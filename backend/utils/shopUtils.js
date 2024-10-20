exports.createJoinUsEmail = (data) => {
  return {
    email: "Giveagift.sa@gmail.com",
    subject: "طلب انضمام لشركاء (Give A Gift)",
    text: `
    Request to join Give A Gift platform has been submitted by ${data.name}.
    Email: ${data.email}
    Phone: ${data.phone}
    Description: ${data.description}
    Website Link: ${data.link}
    `,

    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #222A40;
        }
        p {
          color: #555555;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table, th, td {
          border: 1px solid #d3d3d3;
        }
        th, td {
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #20293F;
          color: #ffffff;
        }
        td {
          background-color: #f9f9f9;
          color: #333333;
        }
        a {
          color: #1a73e8;
          text-decoration: none;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #862026;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
        /* Responsive Styles */
        @media screen and (max-width: 600px) {
          .container {
            padding: 15px;
          }
          h2 {
            font-size: 20px;
          }
          p, th, td {
            font-size: 14px;
          }
          .btn {
            padding: 8px 15px;
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Shop Request to Join</h2>
        <p>A new shop has submitted a request to join our platform. Here are the details:</p>

        <table>
          <tr>
            <th>Shop Name</th>
            <td>${data.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>${data.phone}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>${data.description}</td>
          </tr>
          <tr>
            <th>Website Link</th>
            <td><a href="${data.link}">${data.link}</a></td>
          </tr>
        </table>

        <p>Please review the request and take the necessary actions.</p>

        <a href="mailto:${data.email}" class="btn">Contact Shop</a>
      </div>
    </body>
    </html>
    `,
  };
};
