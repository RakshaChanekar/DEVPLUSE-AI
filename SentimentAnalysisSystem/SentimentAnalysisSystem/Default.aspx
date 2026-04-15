<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" EnableEventValidation="false" Inherits="_Default" %>
<!DOCTYPE html>
<html lang="zxx">

<head>
	<title>Online Store</title>
	<!-- Meta tag Keywords -->
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta charset="UTF-8" />
	<meta name="keywords" content="Electro Store Responsive web template, Bootstrap Web Templates, Flat Web Templates, Android Compatible web template, Smartphone Compatible web template, free webdesigns for Nokia, Samsung, LG, SonyEricsson, Motorola web design"
	/>
	<script>
	    addEventListener("load", function () {
	        setTimeout(hideURLbar, 0);
	    }, false);

	    function hideURLbar() {
	        window.scrollTo(0, 1);
	    }
	</script>
	<!-- //Meta tag Keywords -->

	<!-- Custom-Files -->
	<link href="css/bootstrap.css" rel="stylesheet" type="text/css" media="all" />
	<!-- Bootstrap css -->
	<link href="css/style.css" rel="stylesheet" type="text/css" media="all" />
	<!-- Main css -->
	<link rel="stylesheet" href="css/fontawesome-all.css">
	<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
	<!-- Font-Awesome-Icons-CSS -->
	<link href="css/popuo-box.css" rel="stylesheet" type="text/css" media="all" />
	<!-- pop-up-box -->
	<link href="css/menu.css" rel="stylesheet" type="text/css" media="all" />
	<!-- menu style -->
	<!-- //Custom-Files -->

	<!-- web fonts -->
	<link href="//fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i&amp;subset=latin-ext" rel="stylesheet">
	<link href="//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&amp;subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese"
	    rel="stylesheet">
	<!-- //web fonts -->
	<link href="css/StyleSheet.css" rel="stylesheet"/>

</head>

<body>
<form id="form1" runat="server" >

	<!-- top-header -->
	<%--<div class="agile-main-top">
		<div class="container-fluid">
			<div class="row main-top-w3l py-2">				
				<div class="col-lg-8 header-right mt-lg-0 mt-2">
					<!-- header lists -->
					<ul>
						<li class="text-center border-right text-white">
							<a href="#" data-toggle="modal" data-target="#exampleModal" class="text-white">
								<i class="fas fa-sign-in-alt mr-2"></i> Log In </a>
						</li>
                       
						<li class="text-center border-right text-white">
							<a href="#" data-toggle="modal" data-target="#exampleModal2" class="text-white">
								<i class="fas fa-sign-out-alt mr-2"></i>Register </a>
						</li>
                         <li class="text-center border-right text-white">
							<a href="#"  data-toggle="modal" data-target="#Div1" class="text-white">
								<i class="fas fa-sign-in-alt mr-2"></i> Admin In </a>
						</li>
					</ul>

				</div>
			</div>
		</div>
	</div>--%>

	<!-- log in -->
	<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title text-center">Log In</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<form action="#" method="post">
						<div class="form-group">
							<label class="col-form-label">User Name</label>
							<input type="text" class="form-control" autocomplete="off" placeholder=" " name="Name" required="">
						</div>
						<div class="form-group">
							<label class="col-form-label">Password</label>
							<input type="password" class="form-control" placeholder=" " name="Password" required="">
						</div>
						<div class="right-w3l">
							<%--<input type="submit" class="form-control" value="Log in">--%>
                            <asp:Button ID="Button2" runat="server" class="form-control" Text="Log In" onclick="Button2_Click" />
						</div>
						<div class="sub-w3l">
							<div class="custom-control custom-checkbox mr-sm-2">
								<input type="checkbox" class="custom-control-input" id="customControlAutosizing">
								<label class="custom-control-label" for="customControlAutosizing">Remember me?</label>
							</div>
						</div>
						<p class="text-center dont-do mt-3">Don't have an account?
							<a href="#" data-toggle="modal" data-target="#exampleModal2">
								Register Now</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
    <!--Admin-->
    <div class="modal fade" id="Div1" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title text-center">Log In</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<form action="Adminlogin.aspx" method="get">
						<div class="form-group">
							<label class="col-form-label">Username</label>
							<input type="text" class="form-control" placeholder=" " name="Name" required="">
						</div>
						<div class="form-group">
							<label class="col-form-label">Password</label>
							<input type="password" class="form-control" placeholder=" " name="Password" required="">
						</div>
						<div class="right-w3l">
							<input type="submit" class="form-control" value="Log in">
                           <%-- <asp:Button ID="Button1" class="form-control" runat="server" Text="Button" onclick="Button2_Click" />--%>
						</div>
					<%--	<div class="sub-w3l">
							<div class="custom-control custom-checkbox mr-sm-2">
								<input type="checkbox" class="custom-control-input" id="Checkbox1">
								<label class="custom-control-label" for="customControlAutosizing">Remember me?</label>
							</div>
						</div>
						<p class="text-center dont-do mt-3">Don't have an account?
							<a href="#" data-toggle="modal" data-target="#exampleModal2">
								Register Now</a>
						</p>--%>
					</form>
				</div>
			</div>
		</div>
	</div>
    
	<!-- register -->
	<div class="modal fade" id="exampleModal2" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Register</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<form action="Registration.aspx" method="get">
                    
						<div class="form-group">
							<label class="col-form-label">Your Name</label>
							<input type="text" class="form-control"  placeholder=" " autocomplete="off" name="Name" required="">
                            <%--<asp:TextBox ID="txtSagar" runat="server" class="form-control"></asp:TextBox>--%>
						</div>
						<div class="form-group">
							<label class="col-form-label">Email</label>
							<input type="email" class="form-control" placeholder=" " autocomplete="off" name="Email" required="">
                           <%-- <asp:TextBox ID="txtemail" runat="server" class="form-control" ></asp:TextBox> --%>
						</div>
                        <div class="form-group">
							<label class="col-form-label">Mobile Number</label>
							<input type="text" class="form-control" pattern="[1-9]{1}[0-9]{9}" placeholder=" " autocomplete="off" name="Mobile" required="">
                            <%--<asp:TextBox ID="txtSagar" runat="server" class="form-control"></asp:TextBox>--%>
						</div>
                        <div class="form-group">
							<label class="col-form-label">User Name</label>
							<input type="text" class="form-control" placeholder=" " autocomplete="off" name="Username" required="">
                            <%--<asp:TextBox ID="txtSagar" runat="server" class="form-control"></asp:TextBox>--%>
						</div>
						<div class="form-group">
							<label class="col-form-label">Password</label>
							<input type="password" class="form-control" placeholder=" " pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" name="Password" id="password1" required="">
                            <%--<asp:TextBox ID="txtpwd" runat="server" class="form-control" TextMode="Password"></asp:TextBox> --%>
						</div>
						
						<div class="right-w3l">
							<input type="submit" runat="server" class="form-control" value="New Register" onserverclick="Button2_Click" />
                           <%-- <asp:Button ID="btnregister" runat="server" Text="Register" class="form-control" OnClick="Button2_Click" />--%>
                            
						</div>
						<div class="sub-w3l">
							<div class="custom-control custom-checkbox mr-sm-2">
								<input type="checkbox" class="custom-control-input" required="" id="customControlAutosizing2">
								<label class="custom-control-label" for="customControlAutosizing2">I Accept to the Terms & Conditions</label>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	<!-- //modal -->
	<!-- //top-header -->

	<!-- header-bottom-->

	     <div class="header-bot">
        <div class="container">
            
            <!-- Logo -->
		   <div style="text-align:center">
            <a href="#" class="logo">
                <h1 class="text-center"> Sentiment Analysis And Trend Prediction For e-Commerce Website</h1>
            </a>
			</div>
			
			<br />
			<br />
			<br />


            <!-- Mobile Menu Toggle -->
            <button class="menu-toggle" onclick="toggleMenu()">☰</button>

            <!-- Mobile Navigation -->
            <div class="mobile-nav">
                <a href="Default.aspx">Home</a>
                <a href="Aboutus.aspx">Contact Us</a>
              
                <a href="#" data-toggle="modal" data-target="#exampleModal2">
                    <i class="fas fa-user-plus"></i> Register
                </a>
                <a href="#" data-toggle="modal" data-target="#Div1">
                    <i class="fas fa-user-shield"></i> Admin In
                </a>
				  <a href="#" data-toggle="modal" data-target="#exampleModal">
                    <i class="fas fa-sign-in-alt"></i> Log In
                </a>
				<div class="search-box">
                    <form action="View_product.aspx" method="get" style="display: flex;">
                        <input type="search" placeholder="Search" autocomplete="off" name="txtsearch" required>
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>

            <!-- Desktop Navigation -->
            <div class="nav-container">
                <div class="search-box">
                    <form action="View_product.aspx" method="get" style="display: flex;">
                        <input type="search" placeholder="Search" autocomplete="off" name="txtsearch" required>
                        <button type="submit">Search</button>
                    </form>
                </div>

                <div class="nav-links">
                    <a href="Default.aspx">Home</a>
                    <a href="Aboutus.aspx">Contact Us</a>
                </div>

                <div class="user-links">
                    
                    <a href="#" data-toggle="modal" data-target="#exampleModal2">
                        <i class="fas fa-user-plus"></i> New Register
                    </a>
                    <a href="#" data-toggle="modal" data-target="#Div1">
                        <i class="fas fa-sign-in-alt"></i> Admin In
                    </a>
					<a href="#" data-toggle="modal" data-target="#exampleModal">
                        <i class="fas fa-sign-in-alt"></i> Log In
                    </a>
                </div>
            </div>

        </div>
    </div>
	<!-- shop locator (popup) -->
	<!-- //header-bottom -->
	<!-- navigation -->
	<%--<div class="navbar-inner">
		<div class="container">
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
			
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
				    aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav ml-auto text-center mr-xl-5">
						<li class="nav-item active mr-lg-2 mb-lg-0 mb-2">
							<a class="nav-link" href="Default.aspx">Home
								<span class="sr-only">(current)</span>
							</a>
						</li>
 
						<li class="nav-item mr-lg-2 mb-lg-0 mb-2">
							<a class="nav-link" href="Aboutus.aspx">Contact Us</a>
						</li>
					
					</ul>
				</div>
			</nav>
		</div>
	</div>--%>
	<!-- //navigation -->

	<!-- banner -->
	<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
		<!-- Indicators-->
		<ol class="carousel-indicators">
			<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
			<li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
			<li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
			<li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
		</ol>
		<div class="carousel-inner">
			<div class="carousel-item item1 active">
				<div class="container">
					<div class="w3l-space-banner">
						<div class="carousel-caption p-lg-5 p-sm-4 p-3">
							<%--<p>Get flat
								<span>10%</span> Cashback</p>
							<h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">The
								<span>Big</span>
								Sale
							</h3>
							<a class="button2" href="#">Shop Now </a>--%>
						</div>
					</div>
				</div>
			</div>
			<div class="carousel-item item2">
				<div class="container">
					<div class="w3l-space-banner">
						<div class="carousel-caption p-lg-5 p-sm-4 p-3">
							<%--<p>advanced
								<span>Wireless</span> earbuds</p>
							<h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">Best
								<span>Headphone</span>
							</h3>
							<a class="button2" href="#">Shop Now </a>--%>
						</div>
					</div>
				</div>
			</div>
			<div class="carousel-item item3">
				<div class="container">
					<div class="w3l-space-banner">
						<div class="carousel-caption p-lg-5 p-sm-4 p-3">
							<%--<p>Get flat
								<span>10%</span> Cashback</p>
							<h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">New
								<span>Standard</span>
							</h3>
							<a class="button2" href="#">Shop Now </a>--%>
						</div>
					</div>
				</div>
			</div>
			<div class="carousel-item item4">
				<div class="container">
					<div class="w3l-space-banner">
						<div class="carousel-caption p-lg-5 p-sm-4 p-3">
							<%--<p>Get Now
								<span>40%</span> Discount</p>
							<h3 class="font-weight-bold pt-2 pb-lg-5 pb-4">Today
								<span>Discount</span>
							</h3>
							<a class="button2" href="#">Shop Now </a>--%>
						</div>
					</div>
				</div>
			</div>
		</div>
		<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>


    <%-- Card-container --%>


	<div class="copy-right py-3">
		<div class="container">
			<p class="text-center text-white">© 2025 Online Store. All rights reserved 
				
			</p>
		</div>
	</div>
	<!-- //copyright -->

	<!-- js-files -->
	<!-- jquery -->
	<script src="js/jquery-2.2.3.min.js"></script>
	<!-- //jquery -->

	  <script>
          function toggleMenu() {
              document.querySelector('.mobile-nav').classList.toggle('active');
          }
      </script>

	<!-- nav smooth scroll -->
	<script>
	    $(document).ready(function () {
	        $(".dropdown").hover(
				function () {
				    $('.dropdown-menu', this).stop(true, true).slideDown("fast");
				    $(this).toggleClass('open');
				},
				function () {
				    $('.dropdown-menu', this).stop(true, true).slideUp("fast");
				    $(this).toggleClass('open');
				}
			);
	    });
	</script>
	<!-- //nav smooth scroll -->

	<!-- popup modal (for location)-->
	<script src="js/jquery.magnific-popup.js"></script>
	<script>
	    $(document).ready(function () {
	        $('.popup-with-zoom-anim').magnificPopup({
	            type: 'inline',
	            fixedContentPos: false,
	            fixedBgPos: true,
	            overflowY: 'auto',
	            closeBtnInside: true,
	            preloader: false,
	            midClick: true,
	            removalDelay: 300,
	            mainClass: 'my-mfp-zoom-in'
	        });

	    });
	</script>
	<!-- //popup modal (for location)-->

	<!-- cart-js -->
	<script src="js/minicart.js"></script>
	<script>
	    paypals.minicarts.render(); //use only unique class names other than paypals.minicarts.Also Replace same class name in css and minicart.min.js

	    paypals.minicarts.cart.on('checkout', function (evt) {
	        var items = this.items(),
				len = items.length,
				total = 0,
				i;

	        // Count the number of each item in the cart
	        for (i = 0; i < len; i++) {
	            total += items[i].get('quantity');
	        }

	        if (total < 3) {
	            alert('The minimum order quantity is 3. Please add more to your shopping cart before checking out');
	            evt.preventDefault();
	        }
	    });
	</script>
	<!-- //cart-js -->

	<!-- password-script -->
	<script>
	    window.onload = function () {
	        document.getElementById("password1").onchange = validatePassword;
	        document.getElementById("password2").onchange = validatePassword;
	    }

	    function validatePassword() {
	        var pass2 = document.getElementById("password2").value;
	        var pass1 = document.getElementById("password1").value;
	        if (pass1 != pass2)
	            document.getElementById("password2").setCustomValidity("Passwords Don't Match");
	        else
	            document.getElementById("password2").setCustomValidity('');
	        //empty string means no validation error
	    }
	</script>
	<!-- //password-script -->
	
	<!-- scroll seller -->
	<script src="js/scroll.js"></script>
	<!-- //scroll seller -->

	<!-- smoothscroll -->
	<script src="js/SmoothScroll.min.js"></script>
	<!-- //smoothscroll -->

	<!-- start-smooth-scrolling -->
	<script src="js/move-top.js"></script>
	<script src="js/easing.js"></script>
	<script>
	    jQuery(document).ready(function ($) {
	        $(".scroll").click(function (event) {
	            event.preventDefault();

	            $('html,body').animate({
	                scrollTop: $(this.hash).offset().top
	            }, 1000);
	        });
	    });
	</script>
	<!-- //end-smooth-scrolling -->

	<!-- smooth-scrolling-of-move-up -->
	<script>
	    $(document).ready(function () {
	        /*
	        var defaults = {
	        containerID: 'toTop', // fading element id
	        containerHoverID: 'toTopHover', // fading element hover id
	        scrollSpeed: 1200,
	        easingType: 'linear' 
	        };
	        */
	        $().UItoTop({
	            easingType: 'easeOutQuart'
	        });

	    });
	</script>
	<!-- //smooth-scrolling-of-move-up -->

	<!-- for bootstrap working -->
	<script src="js/bootstrap.js"></script>
	<!-- //for bootstrap working -->
	<!-- //js-files -->
    </form>
</body>

</html>
