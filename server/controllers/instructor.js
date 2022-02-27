import User from "../models/user";
import Course from "../models/course";
import queryString from "query-string";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const makeInstructor = async (req, res) => {
  try {
    //1. find the user from db
    const user = await User.findById(req.user._id).exec();

    //2. if user does'nt have stripe account yet , then create new
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({
        type: "custom",
        country: "US",
      });
      // console.log("ACCOUNT=>", account.id);
      user.stripe_account_id = account.id;
      user.save();
    }

    //3.Create account link based on account id(for frontend to complete on boarding)
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });
    //console.log(accountLink);

    //4. pre fill any information such as email (optional), then send  url response ro frontend
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });

    //5.then send the account link as response to frontend
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (err) {
    console.log("MAKE INSTRUCTOR ERROR", err);
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const account = await stripe.account.retrieve(user.stripe_account_id);
    // console.log("ACCOUNT=>",account);

    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      res.json(statusUpdated);
    }
  } catch (error) {
    console.log(error);
  }
};

export const currentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
      console.log("Instructor");
    }
  } catch (error) {
    console.log(error);
  }
};

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 })
      .exec();
    res.json(courses);
  } catch (error) {
    console.log(error);
  }
};

export const studentCount = async (req, res) => {
  try {
    const users = await User.find({ courses: req.body.courseId })
      .select("_id")
      .exec();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const instructorBalance = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).exec();
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    res.json(balance);
  } catch (error) {
    console.log(error);
  }
};

export const instructorPayoutSettings = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).exec();
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller._id,
      { redirect_url: process.env.STRIPE_SETTINGs_REDIRECT }
    );
    res.json(loginLink.url);
  } catch (error) {
    console.log("Stripe Payout settings Error", error);
  }
};
