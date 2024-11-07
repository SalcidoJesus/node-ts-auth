
import nodemailer, { Transporter } from 'nodemailer'

interface SendmailOptions {
	to: string | string[];
	subject: string;
	htmlbody: string;
	attachments?: Attachment[]
}

interface Attachment {
	filename: string;
	path: string;
}



// todo: attachments

export class EmailService {

	private transporter: Transporter;

	constructor(
		mailerService: string,
		mailerEmail: string,
		senderEmailPassword: string
	) {
		this.transporter = nodemailer.createTransport({
			service: mailerService,
			auth: {
				user: mailerEmail,
				pass: senderEmailPassword
			}
		})
	}


	async sendEmail( options: SendmailOptions ): Promise<boolean> {

		const { htmlbody, subject, to, attachments } = options

		try {

			const sentInformation = await this.transporter.sendMail({
				to,
				subject,
				html: htmlbody,
				attachments
			})

			// console.log( sentInformation );

			return true;
		} catch (error) {

			return false;
		}

	}


}
