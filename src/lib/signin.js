'use client'

export default async function signin({ email, password }) {
    console.log('Signin: ', { email, password });
    return fetch(`http://localhost/api/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Not signin: ' + response.status);
                return { status: 403, data: false };
            }
        })
        .then(data => {
            console.log('Signin: ' + data.data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            return { status: 500, data: false };
        });
}