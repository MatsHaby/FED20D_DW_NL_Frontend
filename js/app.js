const form = document.getElementById('form');
const error = document.getElementById('error');
const app = document.getElementById('app');

// buttons
const btnLogin = document.getElementById('login');
const btnRegister = document.getElementById('register');

function loginUser() {
    fetchPostToBackend('login');
}

btnLogin.addEventListener('click', loginUser);

function createUser() {
    fetchPostToBackend('register');
}
btnRegister.addEventListener('click', createUser);

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
            console.log(data);
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

// what to do when authenticated
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


    </div>
    `;

    document.getElementById('save').addEventListener('click', () => {
        const checkboxValue = document.getElementById('checkbox').checked;

        updateSubscription(data.token, { subscription: checkboxValue });
    });

    document.getElementById('logout').addEventListener('click', logOut);
}

function checkbox(subscriber) {
    if (subscriber) {
        return 'checked';
    }
}

function updateSubscription(token, subscribe) {
    console.log('toek!', token);
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

function saveLoginSession(token) {
    localStorage.setItem('token', token);
}

function isLoggedIn() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`https://fed20d-dw-nl-backend.herokuapp.com/user/${token}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                console.log(data);
                authenticated(data);
            })
            .catch((e) => {
                // error.innerHTML = e.message;
            });
    }
}

function logOut() {
    localStorage.removeItem('token');
    location.reload();
}

isLoggedIn();
