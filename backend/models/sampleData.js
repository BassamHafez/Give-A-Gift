const Shape = require("./shapeModel");
const Shop = require("./shopModel");
const Color = require("./colorModel");

const uploadSampleData = async () => {
  try {
    await Promise.all([
      Shape.insertMany([
        {
          image: "1OSMraS.png",
          price: 0,
        },
        {
          image: "8Nnc16G.png",
          price: 0,
        },
        {
          image: "e4rKcS0.png",
          price: 0,
        },
        {
          image: "F1sU55g.png",
          price: 0,
        },
        {
          image: "fhPyEBT.png",
          price: 0,
        },
        {
          image: "FruSxNc.png",
          price: 0,
        },
        {
          image: "gSHwOPr.png",
          price: 0,
        },
        {
          image: "KnIE0ry.png",
          price: 0,
        },
        {
          image: "mmetlwc.png",
          price: 0,
        },
        {
          image: "mrFHn1o.png",
          price: 0,
        },
        {
          image: "oiPl2QX.png",
          price: 0,
        },
        {
          image: "P5w31EM.png",
          price: 0,
        },
        {
          image: "RmpX0dp.png",
          price: 0,
        },
        {
          image: "v0NFtm0.png",
          price: 0,
        },
        {
          image: "WBxoxBK.png",
          price: 0,
        },
        {
          image: "WjFaCGZ.png",
          price: 0,
        },
      ]),

      Shop.insertMany([
        {
          name: "Elct",
          logo: "shop1.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "DURMA",
          logo: "shop2.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
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
          isOnline: true,
        },
        {
          name: "THE POP UP",
          logo: "shop5.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "VEO",
          logo: "shop6.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "فورج",
          logo: "shop7.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "مهاب",
          logo: "shop8.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "Feel Good Tea",
          logo: "shop9.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "GREEN GARDEN",
          logo: "shop10.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "دايرتين",
          logo: "shop11.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "NOYA",
          logo: "shop12.jpeg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "2 GETHER",
          logo: "shop13.jpeg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "FUN VIBES",
          logo: "shop13.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "شاهين",
          logo: "shop14.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "RUMORS",
          logo: "shop15.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "نجد wear",
          logo: "shop16.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
        },
        {
          name: "4TWINS",
          logo: "shop17.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
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
