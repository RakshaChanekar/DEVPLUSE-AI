<%@ Page Language="C#" AutoEventWireup="true" CodeFile="aboutus.aspx.cs" Inherits="aboutus" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        /* General Styles */
/* General Styles */
/* General Styles */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #eef2f3;
    color: #333;
   
    background: linear-gradient(135deg, #fdfffe, #d8eaff);
}

.containers {
    width: 80%;
    margin: 50px auto;
    text-align: center;
}

h1 {
    font-size: 2.5em;
    color: #0044cc;
    margin-bottom: 20px;
}

/* Team Section */
.team-section {
    
    padding: 30px;
    margin: 20px 0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.team-section h2 {
    font-size: 2em;
    color: #003366;
    margin-bottom: 20px;
}

/* Team Row */
.team-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

/* Team Card */
.team-card {
    background: linear-gradient(135deg, #bdcfe5, #3b82f6);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
    width: 280px;
    text-align: center;
    color: white;
}

.team-card:hover {
    transform: translateY(-5px);
    background: linear-gradient(135deg, #2563eb, #1e3a8a);
}

.team-card img {
    width: 170px;
    height: 170px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 4px solid #fff;
}

.team-card h3 {
    font-size: 1.5em;
    margin-bottom: 5px;
    color: #fff;
}

.position {
    font-size: 1.1em;
    color: #e0f2fe;
    margin-bottom: 10px;
    font-weight: bold;
}

.contact-info {
    font-size: 0.9em;
    color: #bfdbfe;
}

.contact-info span {
    display: block;
    margin: 5px 0;
}

    </style>
    <link href="css/StyleSheet.css" rel="stylesheet"/>
</head>
<body>
    <form id="form1" runat="server">
        <div class="header-bot">
        <div class="container">
            
            <!-- Logo -->
            <a href="#" class="logo">
                 Sentiment Analysis And Trend Prediction for e-Commerce Website
            </a>

            <!-- Mobile Menu Toggle -->
            <button class="menu-toggle" onclick="toggleMenu()">☰</button>

            <!-- Mobile Navigation -->
            <div class="mobile-nav">
                <a href="Default.aspx">Home</a>
                <a href="Aboutus.aspx">Contact Us</a>
                <a href="#" data-toggle="modal" data-target="#exampleModal">
                    <i class="fas fa-sign-in-alt"></i> Log In
                </a>
                <a href="#" data-toggle="modal" data-target="#exampleModal2">
                    <i class="fas fa-user-plus"></i> Register
                </a>
                <a href="#" data-toggle="modal" data-target="#Div1">
                    <i class="fas fa-user-shield"></i> Admin In
                </a>
				<div class="search-box">
                    <form action="View_product.aspx" method="get" style="display: flex;">
                        <input type="search" placeholder="Search product" autocomplete="off" name="txtsearch" required>
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>

            <!-- Desktop Navigation -->
            <div class="nav-container">
                <div class="search-box">
                    <form action="View_product.aspx" method="get" style="display: flex;">
                        <input type="search" placeholder="Search product" autocomplete="off" name="txtsearch" required>
                        <button type="submit">Search</button>
                    </form>
                </div>

                <div class="nav-links">
                    <a href="Default.aspx">Home</a>
                    <a href="Aboutus.aspx">Contact Us</a>
                </div>

                <%--<div class="user-links">
                    <a href="#" data-toggle="modal" data-target="#exampleModal">
                        <i class="fas fa-sign-in-alt"></i> Log In
                    </a>
                    <a href="#" data-toggle="modal" data-target="#exampleModal2">
                        <i class="fas fa-user-plus"></i> Register
                    </a>
                    <a href="#" data-toggle="modal" data-target="#Div1">
                        <i class="fas fa-user-shield"></i> Admin In
                    </a>
                </div>--%>
            </div>

        </div>
    </div>
        <div class="containers">
    <h1>About Our Team</h1>

    <!-- Team Members Container -->
    <div class="team-section">
        <h2>Our Team Members</h2>
        <div class="team-row">
            <!-- Team Member 1 -->
            <div class="team-card">
                <img src="images/aditya.jpg" alt="CEO" />
                <h3>Aditya Arunrao Deshmukh</h3>
                <p class="position">Backend Developer</p>
                <div class="contact-info">
                    <span>✉️ adityaadeshmukh2@gmail.com</span>
                    <span>📞 7083319931</span>
                </div>
            </div>

            <!-- Team Member 2 -->
            <div class="team-card">
                <img src="images/tanvi.jpg" alt="CTO" />
                <h3>Tanvi Dhananjay Ghule</h3>
                <p class="position">UI-UX Designer</p>
                <div class="contact-info">
                    <span>✉️ tanvighule2003@gmail.com</span>
                    <span>📞 7499411495</span>
                </div>
            </div>

            <!-- Team Member 3 -->
            <div class="team-card">
                <img src="images/tanaya.jpg" alt="Developer" />
                <h3>Tanaya Santosh Gughane</h3>
                <p class="position">UI-UX Designer</p>
                <div class="contact-info">
                    <span>✉️ tanaya16gughane@gmail.com</span>
                    <span>📞 9049717791</span>
                </div>
            </div>

            <!-- Team Member 4 -->
            <div class="team-card">
                <img src="images/sanchita.jpg" alt="Designer" />
                <h3>Sanchita Sadanand Kalambe</h3>
                <p class="position">connectivity</p>
                <div class="contact-info">
                    <span>✉️ sanchsans2907@gmail.com</span>
                    <span>📞 9209294131</span>
                </div>
            </div>

            <!-- Team Member 5 -->
            <div class="team-card">
                <img src="images/raksha.jpg" alt="Marketing" />
                <h3>Raksha Mangesh Chanekar</h3>
                <p class="position">Connectivity</p>
                <div class="contact-info">
                    <span>✉️ rakshachanekar@gmail.com</span>
                    <span>📞 8485839425</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Guided by Teacher and HOD Section -->
    <div class="team-section">
        <h2>Guided By</h2>
        <div class="team-row">
            <!-- Teacher Card -->
            <div class="team-card">
                <img src="images/guid.jpeg" alt="Teacher" />
                <h3>Prof. Akhil M. Jaiswal</h3>
                <p class="position">Project Guide</p>
                <div class="contact-info">
                    <span>✉️ akhiljaiswal@gmail.com</span>
                    <span>📞 9028637523</span>
                </div>
            </div>

            <!-- HOD Card -->
            <%--<div class="team-card">
                <img src="images/patient5.png" alt="HOD" />
                <h3>Dr. [HOD Name]</h3>
                <p class="position">Head of Department</p>
                <div class="contact-info">
                    <span>✉️ hod_email@example.com</span>
                    <span>📞 9876543210</span>
                </div>--%>
            </div>
        </div>
    </div>
</div>

    </form>

    	  <script>
          function toggleMenu() {
              document.querySelector('.mobile-nav').classList.toggle('active');
          }
          </script>
</body>
</html>
