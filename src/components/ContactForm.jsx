import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export const ContactForm = () => {
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {  // validate form
        const validationChecks = {
            nameValid: false,
            emailValid: false,
            messageValid: false
        }
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            validationChecks.emailValid = true;
            setEmailError('');
        } else { setEmailError('Please enter a valid email address') }
        validationChecks.nameValid = name ? true : false;
        validationChecks.messageValid = message ? true : false;
        setBtnDisabled(!Object.values(validationChecks).every(item => item === true))
    }, [name, email, message])

    const sendEmail = () => {
        const templateParams = {
            name: name,
            email: email,
            message: message
        }
        emailjs.send(
            import.meta.env.PUBLIC_SERVICE_ID, 
            import.meta.env.PUBLIC_TEMPLATE_ID, 
            templateParams,
            import.meta.env.PUBLIC_EMAIL_PUBLIC_KEY
        ).then(response => {
            if (response.status === 200) {
                setName('');
                setEmail('');
                setMessage('');
                setSuccessMessage('Thanks for reaching out!');
            }
        });
    }

    return (
        <form className="w-50 responsiveCard">
            <div className="mb-3">
                <input id="nameInput" type="text" className="form-control" placeholder="Name"
                    onChange={(e) => setName(e.target.value)} value={name} />
            </div>
            <div className="mb-3">
                <input id="emailInput" type="email" className="form-control" placeholder="Email Address" required
                    onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>
            <div className="mb-3">
                <textarea id="messageInput" className="form-control" placeholder="Message" rows="3"
                    onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
            </div>
            <button type="button" className="btn btn-light" onClick={() => sendEmail()}
                disabled={btnDisabled}>Submit</button>

            {emailError && email && email.length >= 12
            ? <p className='text-white mt-3'>{emailError}</p> 
            : null}

            {successMessage && <p className='text-white mt-3'>{successMessage}</p>}
        </form>
    )
}