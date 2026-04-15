<%@ Page Title="" Language="C#" MasterPageFile="~/Users/UserMasterPage.master" AutoEventWireup="true" CodeFile="My_orders.aspx.cs" Inherits="Users_My_orders" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
<form id="form1" runat="server">
      <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
							<h3 class="heading-tittle text-center font-italic">Products</h3>
							<div class="row">
                                <asp:Repeater ID="Repeater_pview" runat="server" 
                                    DataSourceID="SqlDataSource_pview">
                                    <ItemTemplate>
                                    <div class="col-md-4 product-men mt-5">
									<div class="men-pro-item simpleCart_shelfItem">
										<div class="men-thumb-item text-center">
											<img src='<%# "../photos/" + Eval("photo")%>' alt="" height="120px" width="70px">
											<div class="men-cart-pro">
												<div class="inner-men-cart-pro">
													<%--<a href="Details.aspx?pname=<%#Eval("pname") %>" class="link-product-add-cart">Quick View</a>--%>
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
                                            
                                           <%-- <a href="Addtocart.aspx?pid=<%#Eval("pid") %>&stk=<%#Eval("stock") %>" class="btn btn-primary">Add to cart</a>--%>
                                            <%--<a href="#" data-toggle="modal" data-target="#login" class="text-white"><span class="btn btn-primary">Add to cart</span></a>--%>
											<div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
													<fieldset>
														<%--<input type="hidden" name="cmd" value="_cart" />
														<input type="hidden" name="add" value="1" />
														<input type="hidden" name="business" value=" " />
														<input type="hidden" name="item_name" value="<%#Eval("pname") %>" />
														<input type="hidden" name="amount" value="<%#Eval("prate") %>" />
														<input type="hidden" name="discount_amount" value="1.00" />
														<input type="hidden" name="currency_code" value="USD" />
														<input type="hidden" name="return" value=" " />
														<input type="hidden" name="cancel_return" value=" " />--%>
                                                      
														<%--<input type="submit" name="submit" value="Add to cart" class="button btn" onclick="btncart_Click"; />--%>

													</fieldset>
												</div>
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSource_pview" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand="SELECT * FROM [order_product] WHERE ([user_id] = @user_id)">
                                    <SelectParameters>
                                        <asp:SessionParameter Name="user_id" SessionField="user_id" Type="Int32" />
                                    </SelectParameters>
                                  
                                  
                                </asp:SqlDataSource>
								
								
								
							</div>
						</div>
                        

        
    </form>
</asp:Content>

