const express = require("express");
const app = express();
const Job = require("./models/job.models");
const { initializeDatabase } = require("./db/db.connect");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
app.use(express.json());
initializeDatabase();
// const fs = require("fs");
// const jsonData = fs.readFileSync("jobs.json", "utf-8");
// const parsedJobData = JSON.parse(jsonData);

// async function seedData() {
//   try {
//     for (const job of parsedJobData) {
//       const newJob = new Job({
//         jobTitle: job.jobTitle,
//         companyName: job.companyName,
//         location: job.location,
//         salary: job.salary,
//         jobType: job.jobType,
//         jobDescription:
//          job.jobDescription,
//         qualifications: job.qualifications,
//       });
//       await newJob.save();
//       console.log(newJob.jobTitle);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
// seedData()

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

async function readAllJobs() {
  try {
    const jobs = await Job.find()
    return jobs;
  } catch (error) {
    throw error;
  }
}

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await readAllJobs();
    if (jobs.length != 0) {
      res.json( { jobs: jobs } );
    } else {
      res.status(404).json({ error: "No Job found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs." });
  }
});

async function deleteJobById(jobId) {
  try {
    const getJob = await Job.findByIdAndDelete(jobId);
    return getJob;
  } catch (error) {
    throw error;
  }
}

app.delete("/jobs/:jobId", async (req, res) => {
    try {
        const deletedJob = await deleteJobById(req.params.jobId)
        if (deletedJob) {
            res.status(200).json({message: "Job deleted successfully.", job : deletedJob})
        } else {
            res.status(404).json({error: "Job not found."})
        }
    } catch (error) {
    res.status(500).json({ error: "Failed to delete Job, server error." });
        
    }
})



async function addJob(job) {
  try {
    const newJob = new Job(job);
    const savedJob = await newJob.save();
    return savedJob;
  } catch (error) {
    console.error("Error while saving job:", error);
    throw error;
  }
}

app.post("/jobs", async (req, res) => {
  try {
    const addnew = await addJob(req.body);
    if (addnew) {
      res
        .status(201)
        .json({ message: "Job added successfully.", job: addnew });
    } else {
      res.status(404).json({ message: "Job not added." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add job, server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
