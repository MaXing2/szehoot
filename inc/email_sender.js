exports.to = function (app,nodemailer) {  
//-----------------------------------------------------------Mail-----------------------------------------------------------//
    app.post('/resmail', function (req, res) {
        console.log("email");
        var email = "kurisdteszt@gmail.com";    //send to 
        var confmal = '<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> <title>Regisztráció megerősítés</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen { @font-face { font-family: "Source Sans Pro"; font-style: normal; font-weight: 400; src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff"); } @font-face { font-family: "Source Sans Pro"; font-style: normal; font-weight: 700; src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff"); } } body, table, td, a { -ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */ } table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; } img { -ms-interpolation-mode: bicubic; } a[x-apple-data-detectors] { font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important; } div[style*="margin: 16px 0;"] { margin: 0 !important; } body { width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important; } table { border-collapse: collapse !important; } a { color: #1a82e2; } img { height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none; } </style></head><body style="background-color: #e9ecef;"> <!-- start preheader --> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">Szehoot </div> <!-- end preheader --> <!-- start body --> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <!-- start logo --> <tr> <td align="center" bgcolor="#e9ecef"> <!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"> <![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="http://localhost:3000/" target="_blank" style="display: inline-block;"> <img src="https://eszk.sze.hu/images/ARCULAT/Logok/kari%20logok/sze_logo_fekvo_RGB_GIVK.png" alt="Logo" border="0" width="250" style="display: block;"> </a> </td> </tr> </table> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </td> </tr> <!-- end logo --> <!-- start hero --> <tr> <td align="center" bgcolor="#e9ecef"> <!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"> <![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; border-top: 3px solid #d4dadf;"> <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Regisztráció megerősítés</h1> </td> </tr> </table> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </td> </tr> <!-- end hero --> <!-- start copy block --> <tr> <td align="center" bgcolor="#e9ecef"> <!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"> <![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <!-- start copy --> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">Nyomja meg az alábbi gombot az e -mail cím megerősítéséhez.</p><p> Amennyiben nem regisztált biztonságosan törölheti a levelet.</p> </td> </tr> <!-- end copy --> <!-- start button --> <tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="http://localhost:3000" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Megerősítés</a> </td> </tr> </table> </td> </tr> </table> </td> </tr> <!-- end button --> <!-- start copy --> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">Ha ez nem működik, másolja ki és illessze be az alábbi linket a böngészőjébe:</p> <p style="margin: 0;"><a href="http://localhost:3000/" target="_blank">http://localhost:3000/</a></p> </td> </tr> <!-- end copy --> <!-- start copy --> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf"> <p style="margin: 0;">Üdv,<br> Szehoot csapata</p> </td> </tr> <!-- end copy --> </table> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </td> </tr> <!-- end copy block --> <!-- start footer --> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"> <!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"> <![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <!-- start permission --> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <p style="margin: 0;">Kérem ne válaszoljon erre a levélre!</p> </td> </tr> <!-- end permission --> </table> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </td> </tr> <!-- end footer --> </table> <!-- end body --></body></html>';
        mail(email,confmal);
        // return res.status(200).end("OK");
        res.redirect('/');
      });

      async function mail(tomail,htm) {

        // create default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'szehoot@gmail.com', // user
            pass: 'vcHvx8nj6mrwxMQ', // password
          },
        });
    
        // send mail
        let info = await transporter.sendMail({
          from: '"Szehoot" <szehoot@gmail.com>', // sender address
          to: tomail, // list of receivers , for multiple
          subject: "Szehoot E-mail megerősítés ✔", // Subject line
          // html: "<b>Hello </b> <p>Szeretnéd megerősíteni az e-mail címedet? </p><p>  Kattints a linkre a megerősítéshez: <a href='http://localhost:3000'>link</a></p>" , // html body
          html: htm,
        });
    
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
}