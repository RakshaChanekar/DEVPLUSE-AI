<%@ Page Title="" Language="C#" MasterPageFile="~/Users/UserMasterPage.master" AutoEventWireup="true" CodeFile="OtherSite.aspx.cs" Inherits="Users_Details" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <form id="form1" runat="server">


      <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">Other Site</h3>
                            
                            <h3 class="heading-tittle text-center font-italic">

				<div class="card-container">
        <!-- Amazon Card -->
        <div class="card amazon">
            <img src="../images/amazon.jpg" alt="Amazon">
            <h2>Amazon</h2>
            <%--<p>Best deals on all products.</p>
            <a href="Review_Amazon.aspx?pid=<%#Request.QueryString["pid"] %>" class="shop-btn">Compare</a>--%>
       
           <asp:Repeater ID="Repeater1" runat="server" 
                                    DataSourceID="SqlDataSourceAmazon">
                                    <ItemTemplate>
                                    <div class="col-md-12 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>' alt="" alt="" height="150px" width="90px">
											<div class="men-cart-pro">
												<div class="inner-men-cart-pro">
													<a href="Details.aspx?pname=<%#Eval("pname") %>" class="link-product-add-cart">Quick View</a>
												</div>
											</div>
										</div>
										<div class="item-info-product text-center border-top mt-4">
											<h4 class="pt-1">
												<a href="#"><%#Eval("pname") %></a>
											</h4>
											<div class="info-product-price my-2">
												<span class="item_price">Rate : <%#Eval("prate") %></span>
												<del>MRP : <%#Eval("mrp") %></del>
											</div>
                                            <div class="info-product-price my-2">
												<span class="item_price"> <%#Eval("describe") %></span>
												
											</div>
                                           
                                            <div class="info-product-price my-2">
												<span class="item_price">Display : <%#Eval("display") %></span>
											</div>
											 <div class="info-product-price my-2">
												<span class="item_price">Memory : <%#Eval("memory") %></span>
											</div>
                                           <%-- <a href="Details.aspx?pname=<%#Eval("pname")  %>" class="btn btn-primary">Compare Product</a>
											--%>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSourceAmazon" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand=""></asp:SqlDataSource>        
        </div>
        
        <!-- Meesho Card -->
        <div class="card meesho">
            <img src="../images/rd.png" alt="Meesho">
            <h2>Relience Digital</h2>
            <%--<p>Trendy and affordable products.</p>
            <a href="#" class="shop-btn">Compare</a>--%>

             <asp:Repeater ID="Repeater_pview" runat="server" 
                                    DataSourceID="SqlDataSourceRelienceDigital">
                                    <ItemTemplate>
                                    <div class="col-md-12 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>' alt="" alt="" height="150px" width="90px">
											<div class="men-cart-pro">
												<div class="inner-men-cart-pro">
													<a href="Details.aspx?pname=<%#Eval("pname") %>" class="link-product-add-cart">Quick View</a>
												</div>
											</div>
										</div>
										<div class="item-info-product text-center border-top mt-4">
											<h4 class="pt-1">
												<a href="#"><%#Eval("pname") %></a>
											</h4>
											<div class="info-product-price my-2">
												<span class="item_price">Rate : <%#Eval("prate") %></span>
												<del>MRP : <%#Eval("mrp") %></del>
											</div>
                                            <div class="info-product-price my-2">
												<span class="item_price"> <%#Eval("describe") %></span>
												
											</div>
                                           
                                            <div class="info-product-price my-2">
												<span class="item_price">Display : <%#Eval("display") %></span>
											</div>
                                             <div class="info-product-price my-2">
												<span class="item_price">Memory : <%#Eval("memory") %></span>
											</div>
                                           <%-- <a href="Details.aspx?pname=<%#Eval("pname")  %>" class="btn btn-primary">Compare Product</a>
											--%>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSourceRelienceDigital" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand=""></asp:SqlDataSource>
        </div>
        
        <!-- Flipkart Card -->
        <div class="card flipkart">
            <img src="../images/flipkart22.jpg" alt="Flipkart">
            <h2>Flipkart</h2>
          <%--  <p>Big discounts on top brands.</p>
            <a href="#" class="shop-btn">Compare</a>--%>
            
           <asp:Repeater ID="Repeater2" runat="server" 
                                    DataSourceID="SqlDataSourceFlipkart">
                                    <ItemTemplate>
                                    <div class="col-md-12 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>' alt="" alt="" height="150px" width="90px">
											<div class="men-cart-pro">
												<div class="inner-men-cart-pro">
													<a href="Details.aspx?pname=<%#Eval("pname") %>" class="link-product-add-cart">Quick View</a>
												</div>
											</div>
										</div>
										<div class="item-info-product text-center border-top mt-4">
											<h4 class="pt-1">
												<a href="#"><%#Eval("pname") %></a>
											</h4>
											<div class="info-product-price my-2">
												<span class="item_price">Rate : <%#Eval("prate") %></span>
												<del>MRP : <%#Eval("mrp") %></del>
											</div>
                                            <div class="info-product-price my-2">
												<span class="item_price"> <%#Eval("describe") %></span>
												
											</div>
                                           
                                            <div class="info-product-price my-2">
												<span class="item_price">Display : <%#Eval("display") %></span>
											</div>
                                             <div class="info-product-price my-2">
												<span class="item_price">Memory : <%#Eval("memory") %></span>
											</div>
                                           <%-- <a href="Details.aspx?pname=<%#Eval("pname")  %>" class="btn btn-primary">Compare Product</a>
											--%>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSourceFlipkart" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand=""></asp:SqlDataSource>    
        

        </div>
    </div>
                                </h3>
                            
           <div class="card-container">
				   
					<div class="card meesho" style="width:50%">
						 <%-- <a href="Review_Amazon.aspx?pid=<%# Request.QueryString["pid"] %>" class="shop-btn">Analysis</a>--%>
							<asp:Button ID="Button1" runat="server" class="shop-btn" Text="Analysis" OnClick="Button1_Click1" />
					</div>
		    </div>
	</div>
		  
    </form>
</asp:Content>

