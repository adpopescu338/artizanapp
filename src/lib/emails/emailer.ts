import sgMail from '@sendgrid/mail'

const EMAIL_TEMPLATES = {
  OTP: 'd-5c69793af7964666ab40385006cc5f15',
}

class Emailer {
  sendOtpCommunication(args: { name: string; otp: string; email: string }) {
    return this.send(args.email, EMAIL_TEMPLATES.OTP, {
      name: args.name,
      otp: args.otp,
    })
  }

  private async send(
    to: string,
    templateId: string,
    dynamicTemplateData: object
  ) {
    const args = {
      to,
      from: process.env.SENGRID_FROM_EMAIL as string,
      templateId,
      dynamicTemplateData,
    }

    if (process.env.DO_NOT_SEND_EMAILS === 'true') {
      console.log(
        'Emailer.send: DO_NOT_SEND_EMAILS is true, not sending email',
        args
      )
      return
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
    return sgMail.send(args)
  }
}

export const emailer = new Emailer()
