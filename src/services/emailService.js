const nodemailer=require('nodemailer');
const dotenv=require('dotenv')
dotenv.config();

const sendEmail = async (to, subject, htmlcontent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS 
      },
    });

    await transporter.sendMail({
        from:EMAIL_USER,
        to,
        subject,
        html:htmlcontent
    });
    console.log('sent email successfully');
}catch(error){
    console.log(error.message);

}


}

module.exports=sendEmail