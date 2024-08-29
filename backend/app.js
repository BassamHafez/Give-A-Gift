const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");

const ApiError = require("./utils/ApiError");
const globalErrorHandler = require("./controllers/errorController");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const shapeRoutes = require("./routes/shapeRoutes");
const shopRoutes = require("./routes/shopRoutes");
const cardRoutes = require("./routes/cardRoutes");
// const walletRoutes = require("./routes/walletRoutes");

const app = express();

// GLOBAL MIDDLEWARES

// Serve static files
app.use(express.static(path.join(__dirname, "uploads")));

// set security HTTP headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(hpp());
app.use(
  hpp({
    whitelist: ["price"],
  })
);

// Compress texts (requests) before sent to client
app.use(compression());

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/shapes", shapeRoutes);
app.use("/api/v1/shops", shopRoutes);
app.use("/api/v1/cards", cardRoutes);
// app.use("/api/v1/wallets", walletRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
