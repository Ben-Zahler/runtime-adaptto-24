/*
* <license header>
*/

import {LitElement, html, css} from 'lit';

const SignInStyles = css`
  .sign-in-form {
    margin: 20px;
    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .sign-in-form button {
    padding: 15px 30px;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    background: #3879e0;
    color: #FFFFFF;
    margin-top: 10px;
  }

  .sign-in-form button:hover {
    background: #2b5cab;
  }
  .sign-in-form input {
    width: 70%;
    padding: 10px;
    border-radius: 4px;
    font-size: 16px;
  }
`;


export class SignIn extends LitElement {
  static styles = [
    SignInStyles,
  ];

  static properties = {
    _listItems: {state: true},
  };

  constructor() {
    super();
  }

  render() {
    return html`
      <form @submit=${this.signIn} class='sign-in-form'> 
        <input id="name" aria-label="Your Name" placeholder="Your Name">
        <button type="submit">Sign in</button>
      </form>
    `;
  }

  get nameInput() {
    return this.renderRoot?.querySelector('#name') ?? null;
  }

  async signIn(e) {
    e.preventDefault();
    const forbiddenPage = 'https://www.apollopoll.com/forbidden';
    const homePage = 'https://www.apollopoll.com';
    const currentUrl = new URL(window.location.href);
    const afterSignIn = currentUrl.searchParams.get('redirect');

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
      if (!response.ok) {
        window.location.assign(forbiddenPage);
        return;
      }

      if (afterSignIn) {
        window.location.assign(afterSignIn);
      } else {
        window.location.assign(homePage);
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

