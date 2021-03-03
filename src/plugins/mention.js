/**
	Mention parser plugin for linkify
*/
import * as linkify from '../linkify'

const TT = linkify.scanner.TOKENS; // Text tokens
const {TOKENS: MT, State} = linkify.parser; // Multi tokens, state
const MultiToken = MT.Base;
const S_START = linkify.parser.start;

const TT_DOMAIN = TT.DOMAIN;
const TT_LOCALHOST = TT.LOCALHOST;
const TT_NUM = TT.NUM;
const TT_SLASH = TT.SLASH;
const TT_TLD = TT.TLD;
const TT_UNDERSCORE = TT.UNDERSCORE;
const TT_DOT = TT.DOT;
const TT_AT = TT.AT;

function MENTION(value) {
	this.v = value;
}

linkify.inherits(MultiToken, MENTION, {
	type: 'mention',
	isLink: true,
	toHref() {
		return '/' + this.toString().substr(1);
	}
});

const S_AT = S_START.jump(TT.AT); // @
const S_AT_SYMS = new State();
const S_MENTION = new State(MENTION);
const S_MENTION_DIVIDER = new State();
const S_MENTION_DIVIDER_SYMS = new State();

// @_,
S_AT.t(TT_UNDERSCORE, S_AT_SYMS);

//  @_*
S_AT_SYMS
.t(TT_UNDERSCORE, S_AT_SYMS)
.t(TT_DOT, S_AT_SYMS);

// Valid mention (not made up entirely of symbols)
S_AT
.t(TT_DOMAIN, S_MENTION)
.t(TT_LOCALHOST, S_MENTION)
.t(TT_TLD, S_MENTION)
.t(TT_NUM, S_MENTION);

S_AT_SYMS
.t(TT_DOMAIN, S_MENTION)
.t(TT_LOCALHOST, S_MENTION)
.t(TT_TLD, S_MENTION)
.t(TT_NUM, S_MENTION);

// More valid mentions
S_MENTION
.t(TT_DOMAIN, S_MENTION)
.t(TT_LOCALHOST, S_MENTION)
.t(TT_TLD, S_MENTION)
.t(TT_NUM, S_MENTION)
.t(TT_UNDERSCORE, S_MENTION);

// Mention with a divider
S_MENTION
.t(TT_SLASH, S_MENTION_DIVIDER)
.t(TT_DOT, S_MENTION_DIVIDER)
.t(TT_AT, S_MENTION_DIVIDER);

// Mention _ trailing stash plus syms
S_MENTION_DIVIDER.t(TT_UNDERSCORE, S_MENTION_DIVIDER_SYMS);
S_MENTION_DIVIDER_SYMS.t(TT_UNDERSCORE, S_MENTION_DIVIDER_SYMS);

// Once we get a word token, mentions can start up again
S_MENTION_DIVIDER
.t(TT_DOMAIN, S_MENTION)
.t(TT_LOCALHOST, S_MENTION)
.t(TT_TLD, S_MENTION)
.t(TT_NUM, S_MENTION);

S_MENTION_DIVIDER_SYMS
.t(TT_DOMAIN, S_MENTION)
.t(TT_LOCALHOST, S_MENTION)
.t(TT_TLD, S_MENTION)
.t(TT_NUM, S_MENTION);

export default () => {} // noop for compatibility with v2
