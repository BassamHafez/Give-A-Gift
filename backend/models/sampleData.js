const Shape = require("./shapeModel");
const Shop = require("./shopModel");
const Color = require("./colorModel");

const uploadSampleData = async () => {
  try {
    await Promise.all([
      Shape.insertMany([
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
        {
          image: "front-shape.png",
        },
        {
          image: "back-shape.png",
        },
      ]),

      Shop.insertMany([
        {
          name: "Elct",
          logo: "shop1.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "DURMA",
          logo: "shop2.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "CROWD",
          logo: "shop3.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "MOUEN",
          logo: "shop4.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "THE POP UP",
          logo: "shop5.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "VEO",
          logo: "shop6.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "فورج",
          logo: "shop7.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "مهاب",
          logo: "shop8.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "Feel Good Tea",
          logo: "shop9.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "GREEN GARDEN",
          logo: "shop10.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "دايرتين",
          logo: "shop11.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "NOYA",
          logo: "shop12.jpeg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "2 GETHER",
          logo: "shop13.jpeg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "FUN VIBES",
          logo: "shop13.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "شاهين",
          logo: "shop14.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "RUMORS",
          logo: "shop15.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "نجد wear",
          logo: "shop16.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
        {
          name: "4TWINS",
          logo: "shop17.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
        },
      ]),

      Color.insertMany([
        {
          hex: "#000000",
        },
        {
          hex: "#FFFFFF",
        },
        {
          hex: "#FF5733",
        },
        {
          hex: "#33FF57",
        },
        {
          hex: "#3357FF",
        },
        {
          hex: "#FF33A8",
        },
        {
          hex: "#F39C12",
        },
        {
          hex: "#8E44AD",
        },
        {
          hex: "#1ABC9C",
        },
        {
          hex: "#C0392B",
        },
        {
          hex: "#34495E",
        },
        {
          hex: "#F1C40F",
        },
        {
          hex: "#E74C3C",
        },
        {
          hex: "#9B59B6",
        },
        {
          hex: "#2ECC71",
        },
        {
          hex: "#3498DB",
        },
        {
          hex: "#E67E22",
        },
        {
          hex: "#16A085",
        },
        {
          hex: "#BDC3C7",
        },
        {
          hex: "#7F8C8D",
        },
        {
          hex: "#D35400",
        },
        {
          hex: "#2C3E50",
        },
        {
          hex: "#2980B9",
        },
        {
          hex: "#27AE60",
        },
        {
          hex: "#E74C3C",
        },
        {
          hex: "#9C640C",
        },
        {
          hex: "#45B39D",
        },
        {
          hex: "#D98880",
        },
        {
          hex: "#A569BD",
        },
        {
          hex: "#D4AC0D",
        },
      ]),
    ]);

    console.log("Data loaded successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = uploadSampleData;
