const form = document.getElementById('form');
const error = document.getElementById('error');
const app = document.getElementById('app');
const btnLogin = document.getElementById('login');
const btnRegister = document.getElementById('register');

btnLogin.addEventListener('click', loginUser);
btnRegister.addEventListener('click', createUser);

/**
 * Calls a fetch function to post a login request
 * with login as argument to the URL
 */
function loginUser() {
    fetchPostToBackend('login');
}

/**
 * Calls a fetch function to post a login request
 * with register as argument to the URL
 */
function createUser() {
    fetchPostToBackend('register');
}

/**
 * Sends a fetch with post method to backend to either login or register a user
 * when authenticated login the user and save their token into local storage.
 *
 * @param {string} type
 */
function fetchPostToBackend(type) {
    const adminUser = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    fetch(`https://fed20d-dw-nl-backend.herokuapp.com/user/${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(adminUser),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) throw new Error(data.error);
            authenticated(data);
            saveLoginSession(data.token);
        })
        .catch((e) => {
            error.innerHTML = e.message;
        });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

/**
 * Generates the login-page for the user
 *
 * @param {object} data
 */
function authenticated(data) {
    app.innerHTML = `
    <div class="" id="prem">
        <div class="message">
            <p>${data.email}</p>
            <label class="b-contain">
                <span>Subscribing to newsletter</span>
                <input type="checkbox" id="checkbox" ${checkbox(
                    data.subscription
                )}>
                <div class="b-input"></div>
            </label>
            <button class="btn" id="save">Save</button>
            <button class="btn" id="logout">Logout</button>
            <div id="mm" class="mm"></div>
        </div>
    </div>`;

    document.getElementById('save').addEventListener('click', () => {
        const checkboxValue = document.getElementById('checkbox').checked;
        updateSubscription(data.token, { subscription: checkboxValue });
    });

    document.getElementById('logout').addEventListener('click', logOut);
}
/**
 * Returs the string checked if the value of subscription is true on the user
 * to make the checkbox checked
 *
 * @param {boolean} subscriber
 * @returns {string}
 */
function checkbox(subscriber) {
    if (subscriber) {
        return 'checked';
    }
}

/**
 * Updates the subscription value on the user when the button is clicked.
 * Checked checkbox = subscriber
 *
 * @param {string} token
 * @param {boolean} subscribe
 */
function updateSubscription(token, subscribe) {
    fetch(`https://fed20d-dw-nl-backend.herokuapp.com/user/${token}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(subscribe),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) throw new Error(data.error);
            document.getElementById(
                'mm'
            ).innerHTML = `<div class="kl">${data.message}</div>`;
        })
        .catch((e) => {
            // error.innerHTML = e.message;
        });
}

/**
 * Saves the token into the browsers local storage.
 *
 * @param {string} token
 */
function saveLoginSession(token) {
    localStorage.setItem('token', token);
}

/**
 * Checks if the token is present in the local storage.
 * If the token is there, then login the user directly.
 *
 */
function isLoggedIn() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`https://fed20d-dw-nl-backend.herokuapp.com/user/${token}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                authenticated(data);
            })
            .catch((e) => {
                // error.innerHTML = e.message;
            });
    }
}

/**
 * Logout out the user, remove the token from local storage and reload the package
 * Redirects the user back to the loginpage.
 *
 */
function logOut() {
    localStorage.removeItem('token');
    location.reload();
}

isLoggedIn();
