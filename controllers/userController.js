import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Create a new user
export async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      userId: savedUser._id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error creating user",
    });
  }
}

// User login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error logging in user",
    });
  }
}

// Delete a user
export async function deleteUser(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error deleting user",
    });
  }
}

// Update user details
export async function updateUser(req, res) {
  try {
    const { email, name, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error updating user",
    });
  }
}

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export function sendMessageByCustomer(req, res) {
  const email = req.body.email;
  const userMessage = req.body.message;
  const name = req.body.name;

  if (!email) {
    return res.status(403).json({ message: "Email is required" });
  }

  if (!name) {
    return res.status(403).json({ message: "Name is required" });
  }

  if (!userMessage) {
    return res.status(403).json({ message: "Message is required" });
  }

  const mailOptions = {
    from: email,
    to: "vishishtadilsara2002@gmail.com",
    subject: "New Customer Message",
    html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7fc; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 25px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #eee;">
      
      <h2 style="color: #5a4fcf; margin-top: 0; text-align: center;">
        💌 New Customer Message
      </h2>

      <p style="font-size: 15px; margin-bottom: 10px;">
        You received a new message from your website contact form.
      </p>

      <!-- Customer Name -->
      <div style="background: #e8f7ff; padding: 15px; border-radius: 10px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px;"><strong>👤 Customer Name:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 16px; color: #333;">${name}</p>
      </div>

      <!-- Customer Email -->
      <div style="background: #f2f2ff; padding: 15px; border-radius: 10px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px;"><strong>📧 Customer Email:</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 16px; color: #333;">${email}</p>
      </div>

      <!-- Message -->
      <div style="margin-top: 20px; background: #f6f6f6; padding: 15px; border-radius: 10px;">
        <p style="margin: 0; font-size: 14px;"><strong>📝 Message:</strong></p>
        <p style="white-space: pre-line; margin-top: 5px; font-size: 15px;">
          ${userMessage}
        </p>
      </div>

      <p style="text-align: center; font-size: 13px; color: #777; margin-top: 30px;">
        This message was sent automatically from your website contact form.
      </p>

    </div>
  </div>
  `,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending message", error });
    }
    res.json({ message: "Message sent successfully" });
  });
}

export async function sendEmailWorkDoneIT(job) {
  const mailOptions = {
    from: "vishishtadilsara2002@gmail.com",
    to: job.email,
    subject: "Your IT Job Has Been Completed",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7fc;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 25px;
                    border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <h2 style="color: #4CAF50; text-align: center;">✅ Job Completed</h2>

          <p>Hello <strong>${job.name}</strong>,</p>

          <p>
            We’re happy to inform you that your IT job has been successfully completed.
          </p>

          <div style="margin-top: 15px;">
            <p><strong>Job ID:</strong> ${job.itJobId}</p>
            <p><strong>Service:</strong> ${job.itSolutionType}</p>
          </div>

          <p style="margin-top: 20px;">
            If you have any questions or need further assistance, feel free to reply to this email.
          </p>

          <p style="margin-top: 30px;">
            Best regards,<br />
            <strong>Quontara Global</strong>
          </p>

          <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
            This is an automated message. Please do not reply with sensitive information.
          </p>
        </div>
      </div>
    `,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending message", error });
    }
    res.json({ message: "Message sent successfully" });
  });
}

export async function sendEmailWorkDoneQS(job) {
  const mailOptions = {
    from: "vishishtadilsara2002@gmail.com",
    to: job.email,
    subject: "Your QS Job Has Been Completed",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7fc;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 25px;
                    border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <h2 style="color: #4CAF50; text-align: center;">✅ Job Completed</h2>

          <p>Hello <strong>${job.name}</strong>,</p>

          <p>
            We’re happy to inform you that your QS job has been successfully completed.
          </p>

          <div style="margin-top: 15px;">
            <p><strong>Job ID:</strong> ${job.qsJobId}</p>
            <p><strong>Service:</strong> ${job.jobCategory}</p>
          </div>

          <p style="margin-top: 20px;">
            If you have any questions or need further assistance, feel free to reply to this email.
          </p>

          <p style="margin-top: 30px;">
            Best regards,<br />
            <strong>Quontara Global</strong>
          </p>

          <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
            This is an automated message. Please do not reply with sensitive information.
          </p>
        </div>
      </div>
    `,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending message", error });
    }
    res.json({ message: "Message sent successfully" });
  });
}

export async function sendEmailJobApprovedQS(job) {
  const mailOptions = {
    from: "vishishtadilsara2002@gmail.com",
    to: job.email,
    subject: "Your QS Job Has Been Approved",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7fc;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 25px;
                    border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <h2 style="color: #2563EB; text-align: center;">✔️ Job Approved</h2>

          <p>Hello <strong>${job.name}</strong>,</p>

          <p>
            We’re pleased to inform you that your QS job has been <strong>reviewed and approved</strong>.
            Our team will proceed with the next steps shortly.
          </p>

          <div style="margin-top: 15px;">
            <p><strong>Job ID:</strong> ${job.qsJobId}</p>
            <p><strong>Service:</strong> ${job.jobCategory}</p>
          </div>

          <p style="margin-top: 20px;">
            If you have any additional details to share or questions regarding this job,
            feel free to contact us.
          </p>

          <p style="margin-top: 30px;">
            Best regards,<br />
            <strong>Quontara Global</strong>
          </p>

          <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
            This is an automated message. Please do not reply with sensitive information.
          </p>
        </div>
      </div>
    `,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending message", error });
    }
    res.json({ message: "Approval email sent successfully" });
  });
}

export async function sendEmailJobApprovedIT(job) {
  const mailOptions = {
    from: "vishishtadilsara2002@gmail.com",
    to: job.email,
    subject: "Your IT Job Has Been Approved",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7fc;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 25px;
                    border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

          <h2 style="color: #2563EB; text-align: center;">✔️ Job Approved</h2>

          <p>Hello <strong>${job.name}</strong>,</p>

          <p>
            We’re pleased to inform you that your IT job has been <strong>reviewed and approved</strong>.
            Our team will proceed with the next steps shortly.
          </p>

          <div style="margin-top: 15px;">
            <p><strong>Job ID:</strong> ${job.itJobId}</p>
            <p><strong>Service:</strong> ${job.itSolutionType}</p>
          </div>

          <p style="margin-top: 20px;">
            If you have any additional details to share or questions regarding this job,
            feel free to contact us.
          </p>

          <p style="margin-top: 30px;">
            Best regards,<br />
            <strong>Quontara Global</strong>
          </p>

          <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">
            This is an automated message. Please do not reply with sensitive information.
          </p>
        </div>
      </div>
    `,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending message", error });
    }
    res.json({ message: "Approval email sent successfully" });
  });
}
