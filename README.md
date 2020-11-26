# Personal-Projects
These are the code for my personal projects.

First project:
  Job+ : AWS based Web Service Development – Job Recommendation 08/2020
    Front End:
    • Developed an interactive web page for users to search and apply positions (HTML, CSS, JavaScript, AJAX)
    • Used favorite records to provide personalized position recommendation
    Back End:
    • Created three Java servlets with RESTful APIs to handle HTTP requests and responses
    • Used MySQL database on Amazon RDS to store position data fetched from Github API
    • Used MonkeyLearn API to extract keywords from description of positions
    • Designed algorithms (e.g., content-based recommendation) to implement job recommendation
    • Deployed to Amazon EC2 for more visibility.

Second project:
  Hermes: a Spring and Hibernate based Shopping and Ordering system 09/2020
    Used Spring framework to build a web application for users to shop and order items online.
    • Built a web application based on Spring MVC to support item search and listing (dependency injection, inversion of control, REST API etc.).
    • Implemented security workflow via in-memory and JDBC authentication provided by Spring Security.
    • Utilized Hibernate to provide better support of database operations
    • Developed a Spring Web Flow to support item ordering.
    
Third project:
  Starlink: React JS based Starlink Trajectory Visualization 10/2020
    • Designed and developed a visualization dashboard using ReactJS and D3 to track satellites in real-time based on geo-location.
    • Built location, altitude, and duration based selector to refine satellite search.
    • Animated selected satellite paths on a world map using D3 to improve the user friendness.
    • Deployed the dashboard to Amazon Web Service for demonstration.

Fourth project:
  Tinnews: a Tinder-like News App 11/2020
    • Designed a Tinder Flavored News app based on Android Architectural Component MVVM Pattern to decouple the components
    • Implemented the bottom navigation of three fragments with BottomNavigationView
    • Implemented network APIs with Retrofit and LiveData to pull the latest news data from a RESTFUL endpoint (newsapi.org)
    • Page navigation with JetPack navigation component, adopted SafeArg for type safety when passing parameters.
    • Integrated a 3rd party CardStackView(RecyclerView) to support swipe gestures for like/unlike
    • Built the Room Database with LiveData & ViewModel to support local cache and offline model
