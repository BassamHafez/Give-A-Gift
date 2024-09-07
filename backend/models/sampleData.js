const Shape = require("./shapeModel");
const Shop = require("./shopModel");

const uploadSampleData = async () => {
  try {
    await Promise.all([
      Shape.insertMany([
        {
          image: "bg1.jpg",
        },
        {
          image: "bg2.jpg",
        },
        {
          image: "bg3.jpg",
        },
        {
          image: "bg4.jpg",
        },
        {
          image: "bg5.jpg",
        },
        {
          image: "bg6.jpg",
        },
        {
          image: "bg7.jpg",
        },
        {
          image: "bg8.jpg",
        },
        {
          image: "bg9.jpg",
        },
        {
          image: "bg10.jpg",
        },
        {
          image: "removebg1.png",
        },
        {
          image: "removebg2.png",
        },
        {
          image: "svg1.svg",
        },
        {
          image: "svg2.svg",
        },
        {
          image: "svg3.svg",
        },
        {
          image: "svg4.svg",
        },
        {
          image: "svg5.svg",
        },
        {
          image: "svg6.svg",
        },
        {
          image: "recipientGift.jpg",
        },
        {
          image: "1OSMraS.png",
        },
        {
          image: "8Nnc16G.png",
        },
        {
          image: "e4rKcS0.png",
        },
        {
          image: "F1sU55g.png",
        },
        {
          image: "fhPyEBT.png",
        },
        {
          image: "FruSxNc.png",
        },
        {
          image: "gSHwOPr.png",
        },
        {
          image: "KnIE0ry.png",
        },
        {
          image: "mmetlwc.png",
        },
        {
          image: "mrFHn1o.png",
        },
        {
          image: "oiPl2QX.png",
        },
        {
          image: "P5w31EM.png",
        },
        {
          image: "RmpX0dp.png",
        },
        {
          image: "v0NFtm0.png",
        },
        {
          image: "WBxoxBK.png",
        },
        {
          image: "WjFaCGZ.png",
        },
      ]),

      Shop.insertMany([
        {
          name: "Elct",
          logo: "shop1.png",
          description: "Short description for the shop",
        },
        {
          name: "DURMA",
          logo: "shop2.png",
          description: "Short description for the shop",
        },
        {
          name: "CROWD",
          logo: "shop3.png",
          description: "Short description for the shop",
        },
        {
          name: "MOUEN",
          logo: "shop4.png",
          description: "Short description for the shop",
        },
        {
          name: "THE POP UP",
          logo: "shop5.png",
          description: "Short description for the shop",
        },
        {
          name: "VEO",
          logo: "shop6.jpg",
          description: "Short description for the shop",
        },
        {
          name: "فورج",
          logo: "shop7.png",
          description: "Short description for the shop",
        },
        {
          name: "مهاب",
          logo: "shop8.jpg",
          description: "Short description for the shop",
        },
        {
          name: "Feel Good Tea",
          logo: "shop9.jpg",
          description: "Short description for the shop",
        },
        {
          name: "GREEN GARDEN",
          logo: "shop10.jpg",
          description: "Short description for the shop",
        },
        {
          name: "دايرتين",
          logo: "shop11.png",
          description: "Short description for the shop",
        },
        {
          name: "NOYA",
          logo: "shop12.jpeg",
          description: "Short description for the shop",
        },
        {
          name: "2 GETHER",
          logo: "shop13.jpeg",
          description: "Short description for the shop",
        },
        {
          name: "FUN VIBES",
          logo: "shop13.png",
          description: "Short description for the shop",
        },
        {
          name: "شاهين",
          logo: "shop14.png",
          description: "Short description for the shop",
        },
        {
          name: "RUMORS",
          logo: "shop15.png",
          description: "Short description for the shop",
        },
        {
          name: "نجد wear",
          logo: "shop16.png",
          description: "Short description for the shop",
        },
        {
          name: "4TWINS",
          logo: "shop17.png",
          description: "Short description for the shop",
        },
      ]),
    ]);

    console.log("Data loaded successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = uploadSampleData;
