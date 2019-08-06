module.exports.GeneratePdf = function(data) {
    const fs = require('fs');
    const latex = require('node-latex');
    const path = require('path');
    var pathToSig = path.resolve('../cs467/public/images/signature1.png') 
    console.log('path to sig is: ' + pathToSig);
    //var pathToSig = '/nfs/stak/users/ksiazekm/cs467/public/images/signature1.png';

    //now generate the latex template to be emailed 
    var latexTemplate = `\\documentclass[landscape]{article}
        \\usepackage{graphicx}
        \\begin{document}
        \\centering
        {\\Huge ${data.award} \\par}

        \\subsection*{Awarded to}
        ${data.name}

        \\subsection*{ Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. }
        \\vfill
        Name of Presenter: ${data.presenter}

        \\includegraphics[width=\\linewidth]{${pathToSig}}

        Date: ${data.date}

        \\end{document}`;
    //save the latex string to the template .tex file
    fs.writeFile("cert.tex", latexTemplate, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("path is: " + __dirname); 
        //now create the pdf from the latex .tex file
        var outputFile = './public/awards/award' + data.awardID + '.pdf';
        const input = fs.createReadStream('cert.tex')
        const output = fs.createWriteStream(outputFile)
        const pdf = latex(input)
        pdf.pipe(output)
    }); 
};

module.exports.EmailPdf = function(emailAddress, awardID) {
    const emailer = require('nodemailer');
    var fileAttachment = 'award' + awardID + '.pdf';

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
            filename: fileAttachment,
            path: './public/awards/' + fileAttachment,
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