# **Loopin**

[Live Project on Heroku](https://github.com/RazmikMovsisyan/loopin/)

![Responsive Mockup](/assets/images/am-i-responsive.jpg)

Welcome to **Loopin** – a community platform to share photos and stay in the loop!

Loopin is a modern, responsive full-stack web application designed to empower users to express themselves through short, concise blog posts—similar to old skool instagram. Built with Django and a relational database, Loopin enables users to share thoughts, and interact with content in a dynamic, community-driven environment.

The platform offers essential features such as user registration, authentication, and role-based access, allowing different levels of interaction based on user status. Authenticated users can create, read, update, and delete posts, while also exploring content from the wider user base. Comments help foster engagement, turning the app into a vibrant space for digital expression.

The design prioritizes accessibility, user experience, and mobile responsiveness, ensuring the site is intuitive and enjoyable to use on all devices. Loopin was developed using Agile methodologies, with clearly defined user stories guiding its functionality and interface.

Whether you want to share daily updates, thoughts, or start discussions, Loopin provides a lightweight, social experience tailored for small content creators.

The goal is to promote authentic user interactions and community discussions through a well-structured and secure full-stack platform.

---

## **Table of Contents**
- [Loopin](#Loopin)
  - [Planning](#planning)
    - [Features](#features)
    - [Used Technologies](#used-technologies)
    - [App Owner Goals](#app-owner-goals)
    - [User Stories](#user-stories)
  - [Testing](#testing)
    - [Manual Testing](#manual-testing)
    - [Bugs](#bugs)
  - [Deployment](#deployment)
  - [Version Control](#version-control)
  - [Development Process and Git Commands](#development-process-and-git-commands)
  - [Clone and Fork](#clone-and-fork)
  - [Custom 404 Page](#custom-404-page)
  - [Credits](#credits)
  - [FinishedProduct](#finished-product)


---

## **Planning**

### **Features**
- User authentication and role-based access.
- Post creation with Markdown support.
- Commenting functionality.
- Admin dashboard for managing users and posts.
- Responsive design and accessibility-compliant interface.

### **Used Technologies**
- React, Django Rest Framework, PostgreSQL
- HTML5, CSS3, JavaScript
- Django AllAuth (authentication)
- Cloudinary (image hosting)
- Heroku (deployment)
- Git & GitHub (version control)
- Draw.io / Figma (wireframes and design)
- Markdown (documentation)

---

### **App Owner Goals**
- Provide a safe and friendly platform.
- Enable easy post interaction through comments.
- Allow administrators to moderate content.
- Provide clear UX/UI feedback to users at every step.

---

### **User Stories**

# Authentication & Account Management
- **Sign Up:** As a user, I want to create an account so I can access exclusive features.
- **Sign In:** As a user, I want to sign in to access my account features.
- **Login Status:** As a user, I want to easily check if I am logged in.
- **Token Refresh:** As a user, I want my login session to stay active until I log out.
- **Login Options for Guests:** As a logged-out user, I should see options to sign in or create an account.
- **Edit Profile:** As a logged-in user, I can update my profile picture and bio.
- **Change Username & Password:** As a logged-in user, I can change my username and password to keep my account secure.

# Navigation & User Experience
- **Navbar:** As a user, I want a visible navbar across all pages for easy navigation.
- **Routing:** As a user, I want seamless page transitions without refreshing.
- **Infinite Scroll:** As a user, I want to scroll through posts continuously without clicking "next page."

# Posts & Interactions
- **Create Post:** As a logged-in user, I can create posts to share my images.
- **View Post:** As a user, I can view individual posts to learn more about them.
- **Like Post:** As a logged-in user, I can like posts to show my support.
- **Add Comment:** As a logged-in user, I can comment on posts.
- **View Comments:** As a user, I can read comments on posts.
- **Comment Timestamp:** As a user, I can see when a comment was made.
- **Edit Post:** As a post owner, I can edit my post's title and description.
- **Edit Comment:** As a comment owner, I can edit my comment.
- **Delete Comment:** As a comment owner, I can delete my comment.

# Profiles & Social Interaction
- **User Profile:** As a user, I can view other users' profiles to see their posts.
- **User Stats:** As a user, I can view stats like posts, follows, and bio on a profile.
- **Follow/Unfollow Users:** As a logged-in user, I can follow or unfollow users to customize my feed.
- **View Posts of Followed Users:** As a logged-in user, I can view posts from users I follow.
- **Top Profiles:** As a user, I can see the most followed profiles.

# User Avatars & Personalization
- **User Avatars:** As a user, I want to see avatars for other users to make it easier to identify them.


| **Original Story Title**       | **Included** |
|-------------------------------|---------------|
| **Edit and Delete a Post**    | ✅             |
| **Comment on Post**           | ✅             |
| **User Profile Page**         | ✅             |
| **User Registration**         | ✅             |
| **User Login/Logout**         | ✅             |
| **Delete Post**               | ✅             |
| **Edit Post**                 | ✅             |
| **View Posts**                | ✅             |
| **Create Post**               | ✅             |


---

## **Testing**

### **Manual Testing**

| **Test Case**                  | **Action**                                           | **Expected Result**                                     | **Result** |
|-------------------------------|------------------------------------------------------|---------------------------------------------------------|------------|
| Register new user             | Fill and submit the signup form                      | User is registered and redirected                       | ✅          |
| Login/Logout                  | Provide credentials, log in and out                  | Login state changes are reflected                       | ✅          |
| Create post                   | Fill post form and submit                            | Post is created and displayed                           | ✅          |
| Edit/Delete own post          | Use edit/delete options on own post                  | Post is updated/removed from UI and database            | ✅          |
| Add comment                   | Submit comment on a post                             | Comment is displayed under the post                     | ✅          |
| Admin deletes comment         | Admin deletes comment from dashboard                 | Comment is removed                                      | ✅          |
| Access control                | Unauthenticated user tries to create a post          | Redirected to login page                                | ✅          |

---

### **Bugs**
## Bug 1: env.py Pushed to GitHub
**Description:**  
The `env.py` file was pushed to GitHub due to an incorrect value in the `.gitignore`. This resulted in the Heroku app having a DEV environment variable, which affects various settings, leading to potential issues in production.

**Expected Behavior:**  
The `env.py` file should be ignored by `.gitignore` and never pushed to GitHub.

**Steps to Reproduce:**  
1. Check if the `env.py` file is present in the GitHub repository.
2. Check the `.gitignore` file for an incorrect value that allows `env.py` to be pushed.

**Suggested Fix:**  
Update the `.gitignore` file to properly ignore `env.py` and remove any sensitive information from the GitHub repository.

---

## Bug 2: Frontend and Backend Deployment Issue
**Description:**  
Currently, the frontend and backend are deployed on separate URLs, which may lead to issues during testing and usage.

**Expected Behavior:**  
Both the frontend and backend should be deployed to the same URL to streamline the development process.

**Steps to Reproduce:**  
1. Deploy the frontend and backend to separate URLs.
2. Notice the difficulty in managing both environments separately.

**Suggested Fix:**  
You can combine the projects into one repository by following the guide at the end of the walkthrough, or you can manually configure the two parts to be deployed together on the same URL.

---

## **Deployment**

Deployed via **Heroku**.

Steps:
1. Created Heroku app and linked GitHub repo.
2. Added PostgreSQL and Cloudinary add-ons.
3. Config Vars added: `DATABASE_URL`, `SECRET_KEY`, `CLOUDINARY_URL`, etc.
4. Added `Procfile`, `requirements.txt`, `runtime.txt`.
5. Disabled Django debug, ensured `.env` file excluded via `.gitignore`.

Live link: [Loopin](https://github.com/RazmikMovsisyan/loopin/)

---

## **Version Control**
- Git used throughout, hosted on [GitHub Repo](https://github.com/RazmikMovsisyan/loopin/).
- Clear commit history per feature/bugfix.
- No sensitive info committed.

---

## **Development Process and Git Commands**

- I started the project by using the MS Visual Studio on my local machine.
- I regularly staged changes using the command `git add <filename>` or `git add .`, then committed using `git commit -m 'short descriptive message here'`.
- Finally, I pushed the changes to GitHub with `git push`.
- Every push automatically deploys the latest changes to Heroku from the 'main' branch.

## Clone and Fork the Repository

You can easily clone or fork the **Loopin** repository for further development.

#### **Fork the Repository**

1. Visit the repository on GitHub: [Loopin Repository](https://github.com/RazmikMovsisyan/loopin).
2. Click the **Fork** button to create your own copy.


## Clone and Fork the Repository

You can easily clone or fork the **Loopin** repository for further development.

#### **Fork the Repository**

1. Visit the repository on GitHub: [Loopin Repository](https://github.com/RazmikMovsisyan/loopin).
2. Click the **Fork** button to create your own copy.

#### **Clone the Repository**

The repository has a single branch with a clear commit history. To clone the repository:

##### For **Mac** Users:

1. Open the **Terminal**.
2. Navigate to your preferred directory:  
   ```bash
   cd /path/to/your/directory
   ```
3. Clone the repository:  
   ```bash
   git clone https://github.com/RazmikMovsisyan/loopin
   ```
4. Navigate into the directory:  
   ```bash
   cd Loopin
   ```

##### For **Windows** Users:

1. Open **Command Prompt** or **PowerShell**.
2. Navigate to the desired directory:  
   ```cmd
   cd C:\path\to\your\directory
   ```
3. Clone the repository:  
   ```cmd
   git clone https://github.com/RazmikMovsisyan/loopin
   ```
4. Navigate into the directory:  
   ```cmd
   cd Loopin
   ```

## Custom 404 Page

![error404](assets/images/error404.png)

A custom **404 error page** has been implemented to handle non-existent routes or broken links. Instead of a generic browser message, users are shown a friendly, styled error page that helps guide them back to the main site — improving overall user experience and navigation.


## Credits

All images featured in this project were sourced from **Stockimages**, ensuring high-quality visuals that enhance the overall design and user experience. These images were selected to complement the content and provide a clean, engaging aesthetic throughout the site.

The favicon used in this project was obtained from **Icons8**. Icons8 offers a wide variety of free and premium icons that are perfect for web development projects, and their favicon collection provided just the right visual touch for this site's branding.

Proper credit is given to all resources used in accordance with fair use and licensing guidelines.

Thank you. 

## Finished Product

![finished prodcut](assets/images/finished-product.png)![footer](assets/images/footer.png)![signup](assets/images/signup.png)![login](assets/images/login.png)![post-comment-screenshot](assets/images/post-and-comment-screenshot.png)![profile](assets/images/profile.png)