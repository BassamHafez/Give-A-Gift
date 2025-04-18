const { v4: uuidv4 } = require("uuid");
const Shape = require("./shapeModel");
const Shop = require("./shopModel");
const Color = require("./colorModel");
const Category = require("./categoryModel");
const SpecialCard = require("./SpecialCardModel");

const uploadSampleData = async () => {
  try {
    await Category.insertMany([
      {
        name: "ساعات",
        icon: "smart-watch.png",
      },
      {
        name: "ملابس",
        icon: "laundry.png",
      },
      {
        name: "مطاعم ومقاهي",
        icon: "dinner.png",
      },
      {
        name: "ورد",
        icon: "flowers.png",
      },
      {
        name: "مجوهرات",
        icon: "wedding-ring.png",
      },
      {
        name: "عطور",
        icon: "perfume.png",
      },
    ]);

    const categoriesIDs = await Category.find().select("_id");

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
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop1.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "DURMA",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop2.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "CROWD",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop3.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          token: uuidv4(),
        },
        {
          name: "MOUEN",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop4.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "THE POP UP",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop5.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "VEO",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop6.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "فورج",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[0]._id,
          logo: "shop7.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "مهاب",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[0]._id,
          logo: "shop8.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "Feel Good Tea",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[0]._id,
          logo: "shop9.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "GREEN GARDEN",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[0]._id,
          logo: "shop10.jpg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "Hazel",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[0]._id,
          logo: "shop11.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "NOYA",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[0]._id,
          logo: "shop12.jpeg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "2 GETHER",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop13.jpeg",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "FUN VIBES",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop13.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "شاهين",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop14.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "RUMORS",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop15.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "نجد wear",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop16.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
        },
        {
          name: "4TWINS",
          email: "ammar.yassr.858@gmail.com",
          phone: "201069262663",
          category: categoriesIDs[1]._id,
          logo: "shop17.png",
          description: "Short description for the shop",
          link: "https://shop-url.com",
          isOnline: true,
          token: uuidv4(),
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

    const shopsIDs = await Shop.find().select("_id");

    await SpecialCard.insertMany([
      {
        shop: shopsIDs[0]._id,
        price: 200,
        priority: 3,
      },
      {
        shop: shopsIDs[1]._id,
        price: 300,
      },
      {
        shop: shopsIDs[2]._id,
        price: 400,
      },
      {
        shop: shopsIDs[3]._id,
        price: 500,
      },
      {
        shop: shopsIDs[4]._id,
        price: 600,
      },
      {
        shop: shopsIDs[5]._id,
        price: 700,
      },
      {
        shop: shopsIDs[6]._id,
        price: 800,
      },
      {
        shop: shopsIDs[7]._id,
        price: 900,
      },
      {
        shop: shopsIDs[8]._id,
        price: 1000,
      },
      {
        shop: shopsIDs[9]._id,
        price: 1100,
      },
      {
        shop: shopsIDs[10]._id,
        price: 1200,
        priority: 2,
      },
    ]);

    console.log("Data loaded successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = uploadSampleData;
