'use server'
 
export default async function sendEmail({to, subject, type, content}) {
    const response = await fetch(`http://localhost:12345/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-key': process.env.EMAIL_SECRET
        },
        body: JSON.stringify({
            subject, to, type, content
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Email sent: ' + data.data);
        return data
    } else {
        console.error('Email not sent: ' + response.status);
        return {status: 403, data: 'Something went wrong...'};
    }
}