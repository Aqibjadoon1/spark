# React Developer Assessment

## Objective

Design and develop a modern **Social Networking Web Application** using **React (Vite preferred)**. This assessment is intended to evaluate your understanding of React fundamentals, component architecture, routing, state management, reusable code, responsive UI development, and general software engineering practices.

The application should resemble a production-ready product with clean architecture, consistent design, and maintainable code.

---

# Functional Requirements

## 1. Authentication

Implement a complete authentication flow.

Features:

* User Registration
* User Login
* User Logout
* Protected Routes
* Session persistence (optional but recommended)

Unauthenticated users must not be able to access protected pages.

---

## 2. Landing Page

Create a professional landing page that includes:

* Hero section
* Features section
* Navigation bar
* Call-to-action
* Footer

The landing page should have a polished and professional appearance.

---

## 3. User Profiles

Each user should be able to:

* Create a profile
* Edit profile information
* Upload/change profile picture
* Add a bio
* Add optional social links
* Configure profile visibility

  * Public
  * Private

Private profiles should not be viewable by unauthorized users.

---

## 4. Posts

Users should be able to create posts containing:

* Text
* Links
* Annotations / Notes

Each post should display:

* Author
* Creation date & time
* Reaction count
* Comment count
* View count

Users should also be able to:

* Edit their own posts
* Delete their own posts

---

## 5. Feed

Create a posts feed where users can:

* Browse posts
* Open post details
* View author profiles
* React to posts
* Remove reactions
* Add comments
* View existing comments

---

## 6. Trending Posts

Implement a Trending section.

Trending posts should be calculated using a scoring mechanism based on:

* Number of reactions
* Number of views

The scoring algorithm is your choice but must be documented inside `DOCUMENTATION.md`.

---

## 7. Search

Implement a search feature that allows searching by:

* Post title
* Post description/content
* Author name

Search should provide a smooth and responsive user experience.

---

## 8. Public Profiles

Users should be able to browse other users' profiles.

Rules:

* Public profiles are accessible to everyone.
* Private profiles must remain inaccessible unless permitted.

---

## 9. GPS Friendship

Implement a Nearby Friends feature.

Requirements:

* Dedicated page
* Detect user's current location
* Display nearby users based on their geographical position
* Allow sending friend requests directly from nearby profiles

If a backend is unavailable, nearby users may be simulated.

---

## 10. Deep Linking & Shareable URLs

The application should support proper URL-based navigation.

Every major page should have its own shareable URL, including:

* User profiles
* Individual posts
* Trending posts
* Public pages

Opening a shared URL should always navigate directly to the requested content.

### Protected Route Handling

If a user opens a protected shared link while unauthenticated:

1. Redirect the user to the Login page.
2. Preserve the original destination.
3. After successful authentication, automatically redirect the user back to the requested page.
4. The user should never have to manually navigate back to the shared link after logging in.

---

# Required Pages

At minimum, the application should include:

* Landing Page
* Login
* Registration
* Home / Feed
* Trending Posts
* Post Details
* User Profile
* Edit Profile
* Nearby Friends
* Settings (optional)
* 404 Not Found Page

Additional pages are encouraged if they improve the application.

---

# Technical Requirements

## React

Use:

* React 18+
* Vite (Preferred) or Create React App
* React Router
* Functional Components
* React Hooks

---

## Folder Structure

Follow a scalable and organized folder structure.

Example:

```text
src/
│
├── assets/
├── components/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── context/
├── constants/
├── utils/
├── styles/
└── App.jsx
```

Avoid placing unrelated files together.

---

## Component Design

Components should be:

* Modular
* Reusable
* Small and focused
* Easy to maintain

Avoid duplicated UI and duplicated business logic.

---

## Custom Hooks

Extract reusable logic into custom hooks whenever appropriate.

Examples include:

* useAuth
* useTheme
* useDebounce
* useFetch
* useLocalStorage

Hooks should be generic enough to be reusable across different projects.

---

## Code Quality

Your code should demonstrate:

* Clean architecture
* Proper naming conventions
* Separation of concerns
* Minimal duplication
* Readability
* Maintainability

Large functions should be broken into smaller reusable functions.

---

## Documentation

Every exported:

* Function
* Component
* Custom Hook

must include JSDoc explaining:

* Purpose
* Parameters
* Return values (if applicable)

---

# UI / UX Requirements

## Design

The application should:

* Look professional
* Avoid the typical AI-generated appearance
* Maintain consistent spacing and typography
* Use SVG icons instead of emojis where appropriate
* Have a consistent design system throughout the application

---

## Responsive Design

The application must work properly on:

* Desktop
* Tablet
* Mobile

Mobile layouts should feel like a native mobile application rather than simply a scaled-down desktop interface.

---

## Theme Support

Support both:

* Light Theme
* Dark Theme

Theme switching should remain consistent across every page.

---

## Accessibility (Bonus)

Consider implementing:

* Keyboard navigation
* Proper labels
* Semantic HTML
* Sufficient color contrast

---

# Engineering Expectations

The assessment evaluates more than just whether features work.

You are expected to demonstrate:

* Good React practices
* Reusable architecture
* Generic components
* Reusable custom hooks
* Clean project organization
* Consistent naming
* Proper routing
* Good user experience
* Clean documentation
* Maintainable code

Write code as though it will be maintained by another developer.

---

# Deliverables

Submit the complete source code together with the following documents.

## 1. REPORT.md

A running development log containing:

* Completed features
* Partially completed features
* Known issues
* Assumptions made
* Challenges encountered
* Future improvements

---

## 2. DOCUMENTATION.md

A technical document containing:

* Requirement analysis
* System architecture
* Folder structure explanation
* Routing strategy
* State management approach
* Component organization
* Reusable hooks
* Design decisions
* Trending algorithm explanation
* Search implementation
* Future enhancements

---

# AI Agent Requirement

If an AI coding assistant is used during development, it must continuously maintain and update the following files throughout the implementation:

* `REPORT.md`
* `DOCUMENTATION.md`

These documents should evolve alongside the project and should not be generated only after development is complete.

---

# Submission Requirements

Your submission should include:

* Complete source code
* All required documentation
* Any setup instructions required to run the project

The project should run successfully after dependency installation using standard React commands.

---

# Evaluation Criteria

Candidates will be evaluated based on:

| Category              | Evaluation                                         |
| --------------------- | -------------------------------------------------- |
| React Fundamentals    | Component design, hooks, state management          |
| Routing               | Protected routes, nested routes, deep linking      |
| Authentication        | Login flow, access control, redirect handling      |
| UI/UX                 | Visual quality, consistency, responsiveness        |
| Code Quality          | Readability, maintainability, architecture         |
| Reusability           | Generic components and reusable hooks              |
| Search                | Correctness and user experience                    |
| Trending Algorithm    | Correct implementation and documentation           |
| Documentation         | Quality and completeness                           |
| Engineering Practices | Folder structure, naming conventions, organization |

---

# General Rules

1. Build the application using **React (Vite preferred)**.
2. Keep the UI consistent across all pages.
3. Design should feel handcrafted and professional rather than AI-generated.
4. Use SVG icons where appropriate instead of emojis.
5. The application must be fully responsive on desktop, tablet, and mobile devices. On mobile view , the design should look like a mobile app design.
6. Every page should have a meaningful URL.
7. Shared URLs must always open the correct page.
8. Protected shared links must redirect unauthenticated users to Login and automatically return them to the original destination after successful authentication.
9. Reuse components, hooks, and utilities wherever possible.
10. Avoid duplicate code.
11. Document all reusable functions, hooks, and components using JSDoc.
12. Follow standard React project structure and best practices.
13. Write clean, maintainable, production-quality code.