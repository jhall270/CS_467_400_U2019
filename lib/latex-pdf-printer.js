module.exports.GeneratePdf = function(name, body) {
    const fs = require('fs');
    const latex = require('latex');
    var nameOfPresenter = name.givenName + ' ' + name.familyName;
    var pathToSig = 'public/images/signature1.png';

    //now generate the latex template to be emailed 
    var latexTemplate = `\\documentclass[landscape]{article}
        \\usepackage{lingmacros}
        \\usepackage{tree-dvips}
        \\usepackage{graphicx}
        \\begin{document}
        \\centering
        {\\Huge ${body.award} \\par}

        \\subsection*{Awarded to}
        ${body.name}

        \\subsection*{ Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. }
        \\vfill
        Name of Presenter: ${nameOfPresenter}

        \\includegraphics[width=\\linewidth]{${pathToSig}}

        Date: ${body.awardDate}

        \\end{document}`;
    //save the latex string to the template .tex file
    fs.writeFile("./cert.tex", latexTemplate, function (err) {
        if (err) {
            return console.log(err);
        }
        //now create the pdf from the latex .tex file
        const input = fs.createReadStream('cert.tex')
        const output = fs.createWriteStream('output.pdf')
        const pdf = latex(input)
        pdf.pipe(output)
    }); 
};

module.exports.EmailPdf = function(emailAddress) {
    const emailer = require('nodemailer');

    let transport = emailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let message = {
        from: 'cs467empaward@gmail.com',
        to: emailAddress,
        subject: 'Congratulations!', 
        attachments: [{
            filename: 'cert.pdf',
            path: 'cert.pdf',
            contentType: 'application/pdf'
          }]
    };

    transport.sendMail(message, function(err){
        if(err){
            console.log('Failed!');
            console.log(err);
            return
        }
        console.log('Successfully emailed!')
    })

   
};