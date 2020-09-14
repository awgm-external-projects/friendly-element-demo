var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property, css } from 'lit-element';
/**
 * A Friendly but forgetful element.
 */
let FriendlyElement = class FriendlyElement extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * The Greeting to use
         */
        this.greeting = 'Hello!';
        /**
         * Ask the user for Help?
         */
        this.askUserForName = false;
        /**
         * Ask the user for Help.
         */
        this.hideOhNoMessage = false;
        /**
         * Check if the user is sure about the name they have input.
         */
        this.doCheckIfUserIsSure = false;
        /**
         * Thank the user for providing a name
         */
        this.sayThankyou = false;
        /**
         * is the name accepted?
         */
        this.canRememberName = false;
        /**
         * will the user help me?
         */
        this.userWillHelp = false;
        /**
         * Show the greeting message
         */
        this.showGreeting = false;
        /**
         * Show the TIMED greeting message
         */
        this.showTimedGreeting = true;
        /**
         * Show the confused message
         */
        this.showConfusedMessage = false;
        /**
         * Show the confirm name message
         */
        this.showConfirmNameMessage = false;
        /**
         * the name that has been given to the friendly-element
         */
        this.name = "";
        /**
         * array of previously suggested names
         */
        this.previousSuggestions = [];
        /**
        * The most current name that was suggested
        */
        this.currentSuggestion = "";
        /**
         * The new suggested name that was just input
         */
        this.newSuggestion = "";
    }
    static get styles() {
        return css `
      :host {
        contain: content;
        color: white;
        text-align: center;
      }
      :host([hidden]) {
        display: none;
      }
      .message {
        font-family: 'Source Sans Pro';
        font-size: 20px;
        margin: 0;
        padding: 0;
      }
      .message .name{
        text-transform: capitalize;
        font-style:italic;
      }
      .ohNoMessage{
        font-size:16px;
      }
      .emoji{
        font-size:100px;
        margin:3px;
      }
      .suggestion-history {
        text-align:left;
        padding: 6px;
        margin-top:32px;
        margin-left:25%;
        margin-right:auto;
        font-size: 16px;
        width:50%;
      }
      .history-li{
        text-align:left;
      }
      .footer {
        height: 16px;
      }
    `;
    }
    get sadEmoji() {
        return html `<p class="sad-face emoji">&#x1F622;</p>`;
    }
    get astonishedEmoji() {
        return html `<p class="astonished-face emoji">&#x1F632;</p>`;
    }
    get confusedEmoji() {
        return html `<p class="confused-face emoji">&#x1F615;</p>`;
    }
    get thinkingEmoji() {
        return html `<p class="thinking-face emoji">&#x1F914;</p>`;
    }
    get smilingFaceEmoji() {
        return html `<p class="smiling-face emoji">&#x1F642;</p>`;
    }
    get bigSmileFaceEmoji() {
        return html `<p class="big-smile-face emoji">&#x1F603;</p>`;
    }
    get smilingEyesEmoji() {
        return html `<p class="smiling-eyes emoji">&#x1F60A;</p>`;
    }
    /**
     * Display a greeting message with a timeout to trigger the next message.
     */
    get timedGreetingMessage() {
        let timer = window.setTimeout(() => {
            this.showTimedGreeting = false;
            this.showConfusedMessage = true;
            window.clearTimeout(timer);
        }, 2000); //wait 2 seconds
        return this.greetingMessage;
    }
    /**
     * Display a greeting message using the given greeting.
     * if the element can remember it's name, be happier.
     */
    get greetingMessage() {
        return html `
    <div @dblclick=${this.reset}>
      ${this.canRememberName ? this.bigSmileFaceEmoji : this.smilingFaceEmoji}
      <p><span class="greeting">${this.greeting}</span></p>
      <p><span> I'm a Web Component named ${this.getName()}</span></p>
    </div>`;
    }
    /**
     * Display a message when the element can't remember it's name.
     */
    get confusedMessage() {
        let timer = window.setTimeout(() => {
            this.showConfusedMessage = false;
            window.clearTimeout(timer);
        }, 2000); //wait 2 seconds
        return html `
      <div>
        ${this.confusedEmoji}
        <p><span> Ummmmmmm ... </span></p>
      </div>
    `;
    }
    /**
     * Display a message asking the user for help.
     * note: they can only say yes.
     */
    get askForHelpMessage() {
        return html `
      <div id="" class="">
        <p class="ohNoMessage">
          ${this.sadEmoji}
          <span>Oh No! I don't remember my name!</span>
        </p>
        <p>Can you help me?</p>
        <button class="can-you-help-button" @click=${this.userAgreedToHelp}>Of Course!</button>
      </div>
    `;
    }
    /**
     * Display a thankyou message
     */
    get thankYouMessage() {
        this.greeting = `It's a pleasure to meet you.`;
        let timer = window.setTimeout(() => {
            this.sayThankyou = false;
            this.showGreeting = true;
            window.clearTimeout(timer);
        }, 4000); //wait 4 seconds
        return html `
      <div>
        ${this.smilingEyesEmoji}
        <p>Yay! Thank you friend!</p>
      </div>
    `;
    }
    /**
     * Display and input and submit button the user can use to input a name.
     */
    get getNameMessage() {
        this.hideOhNoMessage = true;
        return html `
      <div class="name-suggestion-form">
        ${this.thinkingEmoji}
        <p>What could my name be?</p>
        <form>
          <input class="name-suggestion" type="text" .value=${this.newSuggestion} @input=${this.handleNameInput}>
          <button class="submit-suggestion" @click=${this.submitSuggestion}>Submit</button>
        </form>
      </div>
      ${this.previousSuggestions.length > 0 ?
            this.suggestionHistoryDiv : null}
    `;
    }
    /**
     * Ask the user to confirm the name they have provided
     */
    get confirmNameMessage() {
        return html `
      <p>
        ${this.astonishedEmoji}
  <span>Wow! So, my name is actually <span class="name">${this.currentSuggestion}</span> ? </span>
      </p>
      <button class="accept-name" @click=${this.confirmName}>Yes</button>
      <button class="reject-name" @click=${this.rejectName}>No</button>
    `;
    }
    /**
     * When there has been 1 or more previously suggested names, display them in a list.
     */
    get suggestionHistoryDiv() {
        return html `
      <div class="suggestion-history">
        ${this.previousSuggestions.length > 0 ?
            html `
            <span>Previously Suggested Names:</span>
            <ul class="history-ul">
              ${this.previousSuggestions.map(i => html `<li class="history-li">${i}</li>`)}
            </ul>
          `
            :
                html ``}
      </div>
    `;
    }
    /**
     * The footer <div>
     */
    get footerDiv() {
        return html `<div class="footer"></div>`;
    }
    /**
     * The user has agreed to help!
     * Set the appropriate flags.
     */
    userAgreedToHelp() {
        this.userWillHelp = true;
        this.askUserForName = true;
    }
    /**
     * Reset all the flags and values.
     * Essentially returning everything to it's initial state.
     * TODO - See if there is a Lit-element function or something that does this.
     */
    reset() {
        this.greeting = "Hello";
        this.showTimedGreeting = true;
        this.userWillHelp = false;
        this.askUserForName = false;
        this.hideOhNoMessage = false;
        this.doCheckIfUserIsSure = false;
        this.sayThankyou = false;
        this.canRememberName = false;
        this.showConfirmNameMessage = false;
        this.showConfusedMessage = false;
        this.showGreeting = false;
        this.name = "";
        this.previousSuggestions = [];
        this.currentSuggestion = "";
        this.newSuggestion = "";
        console.log('wiped the memory of the friendly element!');
    }
    /**
     * If the element can remember it's name, return it.
     * else, return "..."
     */
    getName() {
        if (this.canRememberName) {
            return html `<span class="name">${this.name}</span>`;
        }
        else {
            return html `<span> ... </span>`;
        }
    }
    /**
     * When the submit name button is clicked
     */
    submitSuggestion(e) {
        e.preventDefault();
        console.log(`The user thinks my name is: "${this.newSuggestion}"`);
        if (!this.newSuggestion) {
            return false;
        }
        if (this.newSuggestion.length > 0) {
            this.currentSuggestion = this.newSuggestion;
            this.previousSuggestions.push(this.currentSuggestion);
        }
        this.newSuggestion = '';
        this.showConfirmNameMessage = true;
        this.askUserForName = false;
        return false;
    }
    /**
     * When the value of the name suggestion input box is changed
     */
    handleNameInput(e) {
        this.newSuggestion = e.target.value;
    }
    /**
     * When the <friendly-element> has been connected to the DOM
     */
    connectedCallback() {
        super.connectedCallback();
        this.name = "";
        this.currentSuggestion = "";
        this.newSuggestion = "";
        console.log('<friendly-element> is now connected to the DOM');
    }
    /**
     * handle the user clicking the "yes" button
     * displayed when the user is asked to confirm the name they suggested
     */
    confirmName() {
        this.name = this.currentSuggestion;
        this.sayThankyou = true;
        this.canRememberName = true;
        this.showConfirmNameMessage = false;
        console.log(`The user confirmed my name is: "${this.name}"`);
    }
    /**
     * handle the user clicking the "No" button
     * displayed when the user is asked to confirm the name they suggested
     */
    rejectName() {
        this.name = '';
        this.askUserForName = true;
        this.showConfirmNameMessage = false;
    }
    /**
     * Render the <friendly-element>
     */
    render() {
        return html `
      <div class="message">
        ${this.showTimedGreeting ? this.timedGreetingMessage : null}
        ${this.showConfusedMessage ? this.confusedMessage : null}
        ${!this.showTimedGreeting && !this.showConfusedMessage && !this.userWillHelp ?
            this.askForHelpMessage : null}
        ${this.askUserForName ? this.getNameMessage : null}
        ${this.showConfirmNameMessage ? this.confirmNameMessage : null}
        ${this.sayThankyou ?
            this.thankYouMessage :
            this.showGreeting && !this.sayThankyou ?
                this.greetingMessage : null}
      </div>
      ${this.footerDiv}
    `;
    }
};
__decorate([
    property({ type: String })
], FriendlyElement.prototype, "greeting", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "askUserForName", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "hideOhNoMessage", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "doCheckIfUserIsSure", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "sayThankyou", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "canRememberName", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "userWillHelp", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "showGreeting", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "showTimedGreeting", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "showConfusedMessage", void 0);
__decorate([
    property({ type: Boolean })
], FriendlyElement.prototype, "showConfirmNameMessage", void 0);
__decorate([
    property()
], FriendlyElement.prototype, "name", void 0);
__decorate([
    property({ type: Array })
], FriendlyElement.prototype, "previousSuggestions", void 0);
__decorate([
    property({ type: String })
], FriendlyElement.prototype, "currentSuggestion", void 0);
__decorate([
    property({ type: String })
], FriendlyElement.prototype, "newSuggestion", void 0);
FriendlyElement = __decorate([
    customElement('friendly-element')
], FriendlyElement);
export { FriendlyElement };
//# sourceMappingURL=friendly-element.js.map