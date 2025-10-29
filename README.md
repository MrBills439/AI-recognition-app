# 🧠 AI-Powered Image Analysis App

An **AI-driven, serverless image analysis web application** that automatically generates human-like product descriptions for e-commerce listings.  
This project demonstrates the integration of **AWS Rekognition**, **Amazon Bedrock**, and **Terraform** to create a fully automated, scalable, and cost-efficient workflow.

---

## 🚀 Project Overview

### 🧩 Situation
E-commerce businesses upload hundreds of product images daily. Creating accurate and consistent descriptions for each image is tedious and time-consuming, especially for small and medium-sized businesses.

### 🎯 Task
Develop a solution that:
- Automatically analyzes uploaded images  
- Identifies objects within each image  
- Generates natural, human-like descriptions using AI

---

## ⚙️ Solution Architecture

### 🛠️ Tools & Technologies
- **Frontend:** HTML, CSS, JavaScript (hosted on Amazon S3)  
- **Backend:** Python (AWS Lambda)  
- **AI Services:** AWS Rekognition, Amazon Bedrock  
- **Infrastructure:** Terraform (IaC)  
- **API Management:** AWS API Gateway  

### 🔁 Workflow
1. User uploads an image via the web interface hosted on **S3**.  
2. The image request is routed through **API Gateway**.  
3. **Lambda** (Python) receives the request and sends the image to **AWS Rekognition** for object detection.  
4. Rekognition returns image labels to **Amazon Bedrock**, which generates a natural-language description.  
5. The AI-generated description is returned to the frontend for display.

---

## ☁️ AWS Architecture Diagram


---

## ✅ AWS Resources Confirmed After Deployment
- API Gateway for secure request handling  
- Lambda function for backend processing  
- S3 bucket for frontend hosting  

All resources were successfully deployed and verified via the AWS Management Console.

---

## 🧩 Challenges & Solutions

### Challenge
When creating the API Gateway with Terraform, the Lambda integration initially failed due to incorrect resource linking.

### Solution
Resolved the issue by attaching the correct **resource ID** and **method ID** in Terraform, ensuring smooth API Gateway ↔ Lambda integration.

### Result
API requests now trigger Lambda successfully, processing images and returning AI-generated descriptions in real time.

---

## 📚 Summary & Learnings
- Built a **fully serverless application** using multiple AWS services.  
- Automated cloud infrastructure using **Terraform**.  
- Integrated **AI capabilities** via AWS Rekognition and Amazon Bedrock.  
- Solved real-world integration challenges between API Gateway and Lambda.  
- Strengthened cloud architecture and problem-solving skills.

---

## 💡 Future Improvements
- Add user authentication (Cognito or IAM-based).  
- Store AI-generated metadata in DynamoDB.  
- Enable batch image uploads and asynchronous processing.  
- Integrate CloudWatch for performance monitoring.

---

## 🧰 How to Deploy (Quick Start)

### Prerequisites
- AWS Account  
- Terraform installed  
- AWS CLI configured  

### Steps
```bash
# Clone the repository
git clone https://github.com/your-username/ai-image-analysis-app.git
cd ai-image-analysis-app

# Initialize Terraform
terraform init

# Preview and deploy
terraform plan
terraform apply


