const Shape = require("./shapeModel");
const Shop = require("./shopModel");

const uploadSampleData = async () => {
  try {
    await Shape.insertMany([
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
    ]);

    await Shop.insertMany([
      {
        name: "Elct",
        logo: "shop1.png",
      },
      {
        name: "DURMA",
        logo: "shop2.png",
      },
      {
        name: "CROWD",
        logo: "shop3.png",
      },
      {
        name: "MOUEN",
        logo: "shop4.png",
      },
      {
        name: "THE POP UP",
        logo: "shop5.png",
      },
      {
        name: "فورج",
        logo: "shop7.jpg",
      },
      {
        name: "مهاب",
        logo: "shop8.jpg",
      },
      {
        name: "Feel Good Tea",
        logo: "shop9.jpg",
      },
      {
        name: "GREEN GARDEN",
        logo: "shop10.jpg",
      },
      {
        name: "دايرتين",
        logo: "shop11.jpg",
      },
      {
        name: "NOYA",
        logo: "shop12.jpeg",
      },
      {
        name: "2 GETHER",
        logo: "shop13.jpeg",
      },
      {
        name: "FUN VIBES",
        logo: "shop13.png",
      },
      {
        name: "شاهين",
        logo: "shop114.png",
      },
      {
        name: "RUMORS",
        logo: "shop15.png",
      },
      {
        name: "نجد wear",
        logo: "shop16.png",
      },
      {
        name: "4TWINS",
        logo: "shop17.png",
      },
    ]);

    console.log("Data loaded successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = uploadSampleData;
