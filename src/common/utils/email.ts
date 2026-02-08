import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter= nodemailer.createTransport({
    host :'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
})

const templates= {
    verification: ( url: string) => ({
        subject: 'Email verification',
        html:  `
            <div>
            <p>Click here to verify your account (expires in 7 days)</p>
            <a href= ${url}>Verify account</a>
            </div>
        `
    }),
    reset: (url: string) => ({
        subject: 'Password reset',
        html: `
         <div>
            <p>Click here to reset your password (expires in 7 days)</p>
            <a href= ${url}>Verify account</a>
         </div>
        `
    })
}
export type  emailType= 'verification'  | 'reset'

export async function sendEmail(type: emailType,to: string, url: string) {
    const template= templates[type](url)
    await transporter.sendMail({
        from: 'Jobboard-platform',
        to,
        subject: template.subject,
        html :template.html
    })
}
