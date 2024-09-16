/*
* <license header>
*/

import {LitElement, html} from 'lit';


export class SignIn extends LitElement {
  static properties = {
    _listItems: {state: true},
  };

  constructor() {
    super();
  }

  render() {
    return html`
      <h2>Please enter your Name to sign in</h2>
      <input id="name" aria-label="Your Name">
      <button @click=${this.signIn}>Sign in</button>
    `;
  }

  get nameInput() {
    return this.renderRoot?.querySelector('#name') ?? null;
  }

  async signIn() {
    const urlParams = new URLSearchParams(window.location.search);

    let forbiddenPage = 'https://www.apollopoll.com/forbidden';

    fetch("https://www.apollopoll.com/api/v1/web/AdapttoService/signIn", {
      method: "POST",
      redirect: 'follow',
      body: JSON.stringify({
        userName: this.nameInput.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => {
      console.log(`url is ${response.url}`, response)
      if (response.ok) {
        window.location.reload();
      } else {
        window.location.href = forbiddenPage;
      }
    })
  }
}

window.onload = () => {
  /* Here you can bootstrap your application and configure the integration with the Adobe Experience Cloud Shell */
  try {
    // attempt to load the Experience Cloud Runtime
    require('./exc-runtime')
    // if there are no errors, bootstrap the app in the Experience Cloud Shell
    init(initRuntime)
  } catch (e) {
    console.log('application not running in Adobe Experience Cloud Shell')
    // fallback mode, run the application without the Experience Cloud Runtime
  }

  customElements.define('demo-signin', SignIn);
}

