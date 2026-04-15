<%@ Page Title="" Language="C#" MasterPageFile="~/Users/UserMasterPage.master" AutoEventWireup="true" CodeFile="All_products.aspx.cs" Inherits="Users_All_products" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <form id="form1" runat="server">
      <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">New  Mobile</h3>
							<div class="row">
                                <asp:Repeater ID="Repeater_pview" runat="server" 
                                    DataSourceID="SqlDataSource_pview">
                                    <ItemTemplate>
                                    <div class="col-md-4 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>' alt="" height="150px" width="90px">
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
												<span class="item_price"><%#Eval("prate") %></span>
												<del><%#Eval("mrp") %></del>
											</div>
                                            <a href="Details.aspx?pname=<%#Eval("pname") %>" class="btn btn-primary">Other Platform</a>
											<%--<div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
													<fieldset>
														<input type="hidden" name="cmd" value="_cart" />
														<input type="hidden" name="add" value="1" />
														<input type="hidden" name="business" value=" " />
														<input type="hidden" name="item_name" value="Samsung Galaxy J7" />
														<input type="hidden" name="amount" value="200.00" />
														<input type="hidden" name="discount_amount" value="1.00" />
														<input type="hidden" name="currency_code" value="USD" />
														<input type="hidden" name="return" value=" " />
														<input type="hidden" name="cancel_return" value=" " />
														<input type="submit" name="submit" value="Add to cart" class="button btn" />
													</fieldset>
												</div>--%>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSource_pview" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand="SELECT * FROM [Add_Product] where category='Mobile'"></asp:SqlDataSource>
								
								
								
							</div>
						</div>

        <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">New TV </h3>
							<div class="row">
                                <asp:Repeater ID="Repeater1" runat="server" 
                                    DataSourceID="SqlDataSource1">
                                    <ItemTemplate>
                                    <div class="col-md-4 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>'  alt="" height="150px" width="90px">
											<div class="men-cart-pro">
												<div class="inner-men-cart-pro">
													<a href="#" class="link-product-add-cart">Quick View</a>
												</div>
											</div>
										</div>
										<div class="item-info-product text-center border-top mt-4">
											<h4 class="pt-1">
												<a href="#"><%#Eval("pname") %></a>
											</h4>
											<div class="info-product-price my-2">
												<span class="item_price"><%#Eval("prate") %></span>
												<del><%#Eval("mrp") %></del>
											</div>
                                             <a href="Details.aspx?pname=<%#Eval("pname") %>" class="btn btn-primary">Other Platform</a>
											<%--<div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
													<fieldset>
														<input type="hidden" name="cmd" value="_cart" />
														<input type="hidden" name="add" value="1" />
														<input type="hidden" name="business" value=" " />
														<input type="hidden" name="item_name" value="Samsung Galaxy J7" />
														<input type="hidden" name="amount" value="200.00" />
														<input type="hidden" name="discount_amount" value="1.00" />
														<input type="hidden" name="currency_code" value="USD" />
														<input type="hidden" name="return" value=" " />
														<input type="hidden" name="cancel_return" value=" " />
														<input type="submit" name="submit" value="Add to cart" class="button btn" />
													</fieldset>
												</div>--%>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSource1" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand="SELECT * FROM [Add_Product] where category='TV'"></asp:SqlDataSource>
								
								
								
							</div>
						</div>


         <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">New Laptop </h3>
							<div class="row">
                                <asp:Repeater ID="Repeater2" runat="server" 
                                    DataSourceID="SqlDataSource2">
                                    <ItemTemplate>
                                    <div class="col-md-4 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>'  alt="" height="150px" width="90px">
											<div class="men-cart-pro">
												<div class="inner-men-cart-pro">
													<a href="#" class="link-product-add-cart">Quick View</a>
												</div>
											</div>
										</div>
										<div class="item-info-product text-center border-top mt-4">
											<h4 class="pt-1">
												<a href="#"><%#Eval("pname") %></a>
											</h4>
											<div class="info-product-price my-2">
												<span class="item_price"><%#Eval("prate") %></span>
												<del><%#Eval("mrp") %></del>
											</div>
                                             <a href="Details.aspx?pname=<%#Eval("pname") %>" class="btn btn-primary">Other Platform</a>
											<%--<div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
													<fieldset>
														<input type="hidden" name="cmd" value="_cart" />
														<input type="hidden" name="add" value="1" />
														<input type="hidden" name="business" value=" " />
														<input type="hidden" name="item_name" value="Samsung Galaxy J7" />
														<input type="hidden" name="amount" value="200.00" />
														<input type="hidden" name="discount_amount" value="1.00" />
														<input type="hidden" name="currency_code" value="USD" />
														<input type="hidden" name="return" value=" " />
														<input type="hidden" name="cancel_return" value=" " />
														<input type="submit" name="submit" value="Add to cart" class="button btn" />
													</fieldset>
												</div>--%>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSource2" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand="SELECT * FROM [Add_Product] where category='Laptop'"></asp:SqlDataSource>
								
								
								
							</div>
						</div>


         <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">New Smartwatch </h3>
							<div class="row">
                                <asp:Repeater ID="Repeater3" runat="server" 
                                    DataSourceID="SqlDataSource3">
                                    <ItemTemplate>
                                    <div class="col-md-4 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>'  alt="" height="150px" width="90px">
											<div class="men-cart-pro">
												<div class="inner-men-cart-pro">
													<a href="#" class="link-product-add-cart">Quick View</a>
												</div>
											</div>
										</div>
										<div class="item-info-product text-center border-top mt-4">
											<h4 class="pt-1">
												<a href="#"><%#Eval("pname") %></a>
											</h4>
											<div class="info-product-price my-2">
												<span class="item_price"><%#Eval("prate") %></span>
												<del><%#Eval("mrp") %></del>
											</div>
                                             <a href="Details.aspx?pname=<%#Eval("pname") %>" class="btn btn-primary">Other Platform</a>
											<%--<div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
													<fieldset>
														<input type="hidden" name="cmd" value="_cart" />
														<input type="hidden" name="add" value="1" />
														<input type="hidden" name="business" value=" " />
														<input type="hidden" name="item_name" value="Samsung Galaxy J7" />
														<input type="hidden" name="amount" value="200.00" />
														<input type="hidden" name="discount_amount" value="1.00" />
														<input type="hidden" name="currency_code" value="USD" />
														<input type="hidden" name="return" value=" " />
														<input type="hidden" name="cancel_return" value=" " />
														<input type="submit" name="submit" value="Add to cart" class="button btn" />
													</fieldset>
												</div>--%>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSource3" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand="SELECT * FROM [Add_Product] where category='Smartwatch'"></asp:SqlDataSource>
								
								
								
							</div>
						</div>


         <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">New Earphone </h3>
							<div class="row">
                                <asp:Repeater ID="Repeater4" runat="server" 
                                    DataSourceID="SqlDataSource4">
                                    <ItemTemplate>
                                    <div class="col-md-4 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>'  alt="" height="150px" width="90px">
											<div class="men-cart-pro">
												<div class="inner-men-cart-pro">
													<a href="#" class="link-product-add-cart">Quick View</a>
												</div>
											</div>
										</div>
										<div class="item-info-product text-center border-top mt-4">
											<h4 class="pt-1">
												<a href="#"><%#Eval("pname") %></a>
											</h4>
											<div class="info-product-price my-2">
												<span class="item_price"><%#Eval("prate") %></span>
												<del><%#Eval("mrp") %></del>
											</div>
                                             <a href="Details.aspx?pname=<%#Eval("pname") %>" class="btn btn-primary">Other Platform</a>
											<%--<div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
													<fieldset>
														<input type="hidden" name="cmd" value="_cart" />
														<input type="hidden" name="add" value="1" />
														<input type="hidden" name="business" value=" " />
														<input type="hidden" name="item_name" value="Samsung Galaxy J7" />
														<input type="hidden" name="amount" value="200.00" />
														<input type="hidden" name="discount_amount" value="1.00" />
														<input type="hidden" name="currency_code" value="USD" />
														<input type="hidden" name="return" value=" " />
														<input type="hidden" name="cancel_return" value=" " />
														<input type="submit" name="submit" value="Add to cart" class="button btn" />
													</fieldset>
												</div>--%>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSource4" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand="SELECT * FROM [Add_Product] where category='Earphone'"></asp:SqlDataSource>
								
								
								
							</div>
						</div>
    </form>
</asp:Content>

