const fs = require("fs");
const { promisify } = require("util");
const formidable = require("formidable");
const connectDB = require("./_db.cjs");
const Video = require("../server/models/Video");
const Article = require("../server/models/Article");
const Player = require("../server/models/Player");
const AcademyEnrollment = require("../server/models/AcademyEnrollment");
const GroundBooking = require("../server/models/GroundBooking");
const Tour = require("../server/models/Tour");
const TourBooking = require("../server/models/TourBooking");

const parseJsonBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        return resolve({});
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
};

const parseMultipartBody = async (req) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);

      const convertedFiles = {};

      const convertFile = async (file) => {
        if (!file || !file.filepath) return null;
        const buffer = await fs.promises.readFile(file.filepath);
        const contentType = file.mimetype || "application/octet-stream";
        return `data:${contentType};base64,${buffer.toString("base64")}`;
      };

      try {
        for (const [key, value] of Object.entries(files)) {
          if (Array.isArray(value)) {
            convertedFiles[key] = await Promise.all(value.map(convertFile));
          } else {
            convertedFiles[key] = await convertFile(value);
          }
        }
        resolve({ fields, files: convertedFiles });
      } catch (readError) {
        reject(readError);
      }
    });
  });
};

const buildResponse = (res, status, payload) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  res.writeHead(status, headers);
  res.end(JSON.stringify(payload));
};

const normalizeSegments = (req) => {
  let segments = [];
  if (req.query && req.query.slug) {
    if (Array.isArray(req.query.slug)) {
      segments = req.query.slug.filter(Boolean);
    } else if (typeof req.query.slug === "string") {
      segments = req.query.slug.split("/").filter(Boolean);
    }
  }

  if (segments.length === 0 && typeof req.url === "string") {
    const url = req.url.split("?")[0];
    segments = url.split("/").filter((segment) => segment && segment !== "api");
  }

  return segments;
};

const getBody = async (req) => {
  const contentType = (req.headers["content-type"] || "").toLowerCase();
  if (contentType.includes("multipart/form-data")) {
    const { fields, files } = await parseMultipartBody(req);
    return { ...fields, ...files };
  }

  if (contentType.includes("application/json")) {
    return await parseJsonBody(req);
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const raw = await parseJsonBody(req).catch(() => ({}));
    return raw;
  }

  return {};
};

const handler = async (req, res) => {
  const method = req.method?.toUpperCase();
  const segments = normalizeSegments(req);

  if (method === "OPTIONS") {
    return buildResponse(res, 204, { ok: true });
  }

  try {
    await connectDB();

    const [resource, id, extra] = segments;
    const query = req.query || {};

    if (resource === "health" && method === "GET") {
      return buildResponse(res, 200, { status: "OK", message: "Chitral Markhors API is running" });
    }

    if (resource === "videos") {
      if (!id) {
        if (method === "GET") {
          const category = query.category;
          const filter = {};
          if (category && category !== "all") filter.category = category;
          const videos = await Video.find(filter).select("-videoUrl").sort({ createdAt: -1 });
          return buildResponse(res, 200, videos);
        }

        if (method === "POST") {
          const body = await getBody(req);
          const videoUrl = body.video || body.videoUrl;
          const thumbnailUrl = body.thumbnail || body.thumbnailUrl;

          const video = new Video({
            title: body.title,
            category: body.category,
            date: body.date,
            duration: body.duration,
            description: body.description,
            videoUrl: videoUrl || null,
            thumbnailUrl: thumbnailUrl || null,
            fileSize: Number(body.fileSize) || 0,
          });

          const saved = await video.save();
          return buildResponse(res, 201, saved);
        }
      }

      if (id && !extra) {
        if (method === "GET") {
          const video = await Video.findById(id);
          if (!video) return buildResponse(res, 404, { error: "Video not found" });
          video.views += 1;
          await video.save();
          return buildResponse(res, 200, video);
        }

        if (method === "PUT") {
          const body = await getBody(req);
          const videoUrl = body.video || body.videoUrl;
          const thumbnailUrl = body.thumbnail || body.thumbnailUrl;

          const updated = {
            title: body.title,
            category: body.category,
            date: body.date,
            duration: body.duration,
            description: body.description,
            videoUrl: videoUrl || body.videoUrl,
            thumbnailUrl: thumbnailUrl || body.thumbnailUrl,
          };

          const video = await Video.findByIdAndUpdate(id, updated, { new: true });
          if (!video) return buildResponse(res, 404, { error: "Video not found" });
          return buildResponse(res, 200, video);
        }

        if (method === "DELETE") {
          await Video.findByIdAndDelete(id);
          return buildResponse(res, 200, { message: "Video deleted successfully" });
        }
      }
    }

    if (resource === "articles") {
      if (!id) {
        if (method === "GET") {
          const category = query.category;
          const filter = {};
          if (category && category !== "all") filter.category = category;
          const articles = await Article.find(filter).sort({ createdAt: -1 });
          return buildResponse(res, 200, articles);
        }

        if (method === "POST") {
          const body = await getBody(req);
          const article = new Article({
            title: body.title,
            category: body.category,
            date: body.date,
            excerpt: body.excerpt,
            content: body.content,
            image: body.image || "/main-banner.png",
          });
          const saved = await article.save();
          return buildResponse(res, 201, saved);
        }
      }

      if (id && !extra) {
        if (method === "GET") {
          const article = await Article.findById(id);
          if (!article) return buildResponse(res, 404, { error: "Article not found" });
          return buildResponse(res, 200, article);
        }

        if (method === "PUT") {
          const body = await getBody(req);
          const updated = {
            title: body.title,
            category: body.category,
            date: body.date,
            excerpt: body.excerpt,
            content: body.content,
            image: body.image,
          };
          const article = await Article.findByIdAndUpdate(id, updated, { new: true });
          if (!article) return buildResponse(res, 404, { error: "Article not found" });
          return buildResponse(res, 200, article);
        }

        if (method === "DELETE") {
          await Article.findByIdAndDelete(id);
          return buildResponse(res, 200, { message: "Article deleted successfully" });
        }
      }
    }

    if (resource === "players") {
      if (!id) {
        if (method === "GET") {
          const players = await Player.find().sort({ createdAt: -1 });
          return buildResponse(res, 200, players);
        }

        if (method === "POST") {
          const body = await getBody(req);
          const imageUrl = body.image || body.imageUrl || body.imageUrl || body.image;
          const newPlayer = new Player({
            name: body.name,
            position: body.position,
            description: body.description,
            imageUrl: imageUrl || "/main-banner.png",
          });
          const saved = await newPlayer.save();
          return buildResponse(res, 201, saved);
        }
      }

      if (id && !extra && method === "DELETE") {
        await Player.findByIdAndDelete(id);
        return buildResponse(res, 200, { message: "Player deleted" });
      }
    }

    if (resource === "academy") {
      if (!id) {
        if (method === "GET") {
          const filter = {};
          if (query.userEmail) filter.userEmail = query.userEmail;
          const enrollments = await AcademyEnrollment.find(filter).sort({ createdAt: -1 });
          return buildResponse(res, 200, enrollments);
        }

        if (method === "POST") {
          const body = await getBody(req);
          const enrollment = new AcademyEnrollment({
            name: body.name,
            fatherName: body.fatherName,
            address: body.address,
            contactNumber: body.contactNumber,
            age: Number(body.age),
            position: body.position,
            cnicBForm: body.cnicBForm,
            userEmail: body.userEmail || undefined,
            userId: body.userId || undefined,
          });
          const saved = await enrollment.save();
          return buildResponse(res, 201, saved);
        }
      }

      if (id && !extra) {
        if (method === "PUT") {
          const body = await getBody(req);
          if (!["pending", "approved", "rejected"].includes(body.status)) {
            return buildResponse(res, 400, { message: "Invalid status" });
          }
          const updatedEnrollment = await AcademyEnrollment.findByIdAndUpdate(id, { status: body.status }, { new: true });
          if (!updatedEnrollment) return buildResponse(res, 404, { message: "Enrollment not found" });
          return buildResponse(res, 200, updatedEnrollment);
        }

        if (method === "DELETE") {
          await AcademyEnrollment.findByIdAndDelete(id);
          return buildResponse(res, 200, { message: "Enrollment deleted" });
        }
      }
    }

    if (resource === "ground") {
      if (!id) {
        if (method === "GET") {
          const filter = {};
          if (query.userEmail) filter.userEmail = query.userEmail;
          const bookings = await GroundBooking.find(filter).sort({ createdAt: -1 });
          return buildResponse(res, 200, bookings);
        }

        if (method === "POST") {
          const body = await getBody(req);
          const feeReceiptUrl = body.feeReceipt || body.feeReceiptUrl;

          if (!body.name || !body.cnic || !body.contactNumber || !body.date || !body.timeFrom || !body.timeTo || !feeReceiptUrl) {
            return buildResponse(res, 400, { message: "All required fields must be provided" });
          }

          const dateValue = new Date(body.date);
          if (body.timeFrom >= body.timeTo) {
            return buildResponse(res, 400, { message: "End time must be after start time" });
          }

          const bookingDateStart = new Date(dateValue);
          bookingDateStart.setHours(0, 0, 0, 0);
          const bookingDateEnd = new Date(dateValue);
          bookingDateEnd.setHours(23, 59, 59, 999);

          const existingBookings = await GroundBooking.find({
            date: { $gte: bookingDateStart, $lte: bookingDateEnd },
            status: { $in: ["pending", "confirmed"] },
          });

          const timeRangesOverlap = (start1, end1, start2, end2) => {
            const s1 = new Date(`2000-01-01T${start1}`);
            const e1 = new Date(`2000-01-01T${end1}`);
            const s2 = new Date(`2000-01-01T${start2}`);
            const e2 = new Date(`2000-01-01T${end2}`);
            return s1 < e2 && s2 < e1;
          };

          for (const booking of existingBookings) {
            if (timeRangesOverlap(body.timeFrom, body.timeTo, booking.timeFrom, booking.timeTo)) {
              return buildResponse(res, 409, { message: "This time slot overlaps with an existing booking" });
            }
          }

          const newBooking = new GroundBooking({
            name: body.name,
            cnic: body.cnic,
            contactNumber: body.contactNumber,
            feeReceiptUrl,
            date: dateValue,
            timeFrom: body.timeFrom,
            timeTo: body.timeTo,
            userEmail: body.userEmail || undefined,
            userId: body.userId || undefined,
          });

          const saved = await newBooking.save();
          return buildResponse(res, 201, saved);
        }
      }

      if (id && !extra) {
        if (method === "PUT") {
          const body = await getBody(req);
          if (!["pending", "confirmed", "cancelled"].includes(body.status)) {
            return buildResponse(res, 400, { message: "Invalid status" });
          }
          const updated = await GroundBooking.findByIdAndUpdate(id, { status: body.status }, { new: true });
          if (!updated) return buildResponse(res, 404, { message: "Booking not found" });
          return buildResponse(res, 200, updated);
        }

        if (method === "DELETE") {
          await GroundBooking.findByIdAndDelete(id);
          return buildResponse(res, 200, { message: "Booking deleted" });
        }
      }
    }

    if (resource === "tours") {
      if (!id) {
        if (method === "GET") {
          const tours = await Tour.find({ isActive: true }).sort({ createdAt: -1 });
          return buildResponse(res, 200, tours);
        }

        if (method === "POST") {
          const body = await getBody(req);
          const images = body.images || body.image || [];
          const imageArray = Array.isArray(images) ? images : [images];
          if (!body.title || !body.venueName || !body.description || !body.advancePaymentDetails) {
            return buildResponse(res, 400, { message: "Please fill all tour details" });
          }
          const tour = new Tour({
            title: body.title,
            venueName: body.venueName,
            description: body.description,
            advancePaymentDetails: body.advancePaymentDetails,
            images: imageArray.filter(Boolean),
          });
          const saved = await tour.save();
          return buildResponse(res, 201, saved);
        }
      }

      if (id && !extra) {
        if (method === "GET") {
          const tour = await Tour.findById(id);
          if (!tour) return buildResponse(res, 404, { message: "Tour not found" });
          return buildResponse(res, 200, tour);
        }

        if (method === "PUT") {
          const body = await getBody(req);
          const images = body.images || body.image || [];
          const imageArray = Array.isArray(images) ? images : [images];
          const updatePayload = {
            title: body.title,
            venueName: body.venueName,
            description: body.description,
            advancePaymentDetails: body.advancePaymentDetails,
          };
          if (imageArray.length > 0 && imageArray.some(Boolean)) {
            updatePayload.images = imageArray.filter(Boolean);
          }
          const updatedTour = await Tour.findByIdAndUpdate(id, updatePayload, { new: true });
          if (!updatedTour) return buildResponse(res, 404, { message: "Tour not found" });
          return buildResponse(res, 200, updatedTour);
        }

        if (method === "DELETE") {
          await Tour.findByIdAndDelete(id);
          await TourBooking.deleteMany({ tourId: id });
          return buildResponse(res, 200, { message: "Tour deleted" });
        }
      }

      if (id && extra === "book" && method === "POST") {
        const body = await getBody(req);
        if (!body.name || !body.phoneNumber || !body.idCardNumber || !body.address || !body.paymentReceipt) {
          return buildResponse(res, 400, { message: "Please complete all required fields and upload a payment receipt" });
        }

        const tour = await Tour.findById(id);
        if (!tour) return buildResponse(res, 404, { message: "Tour not found" });

        const booking = new TourBooking({
          tourId: tour._id,
          tourTitle: tour.title,
          name: body.name,
          phoneNumber: body.phoneNumber,
          idCardNumber: body.idCardNumber,
          address: body.address,
          paymentReceiptUrl: body.paymentReceipt,
          userEmail: body.userEmail || undefined,
          userId: body.userId || undefined,
        });
        const saved = await booking.save();
        return buildResponse(res, 201, saved);
      }

      if (id === "bookings") {
        const bookingId = extra;
        if (!bookingId) {
          if (method === "GET") {
            const filter = {};
            if (query.userEmail) filter.userEmail = query.userEmail;
            const bookings = await TourBooking.find(filter).sort({ createdAt: -1 });
            return buildResponse(res, 200, bookings);
          }
        }

        if (bookingId) {
          if (method === "PUT") {
            const body = await getBody(req);
            const updated = await TourBooking.findByIdAndUpdate(bookingId, { status: body.status }, { new: true });
            if (!updated) return buildResponse(res, 404, { message: "Tour booking not found" });
            return buildResponse(res, 200, updated);
          }

          if (method === "DELETE") {
            await TourBooking.findByIdAndDelete(bookingId);
            return buildResponse(res, 200, { message: "Tour booking deleted" });
          }
        }
      }
    }

    return buildResponse(res, 404, { error: "Route not found" });
  } catch (error) {
    console.error(error);
    return buildResponse(res, 500, { error: error.message || "Internal Server Error" });
  }
};

module.exports = handler;
