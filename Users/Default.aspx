<%@ Page Title="" Language="C#" MasterPageFile="~/Users/UserMasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Users_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <form id="form1" runat="server">
      

        

        <div class="product-sec1 px-sm-4 px-3 py-sm-5 py-3 mb-4">
            <h3 class="heading-tittle text-center font-italic">Trending Products</h3>

 <!-- Dropdown populated from Add_Product table -->
			<div class="d-flex justify-content-center my-3">
    <div class="d-flex align-items-center" style="gap: 10px;">
        <label for="DropDownList1" style="font-weight: bold; white-space: nowrap;">Select Category</label>
<asp:DropDownList 
    ID="DropDownList1" 
    runat="server" 
    DataSourceID="SqlDataSource1"
    DataTextField="category" 
    DataValueField="category" 
    AutoPostBack="true"
    CssClass="form-control"
	 OnSelectedIndexChanged="DropDownList1_SelectedIndexChanged">
</asp:DropDownList>
	</div>
				</div>
<asp:SqlDataSource 
    ID="SqlDataSource1" 
    runat="server"
    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>"
    SelectCommand="SELECT DISTINCT category FROM Add_Product">
</asp:SqlDataSource>
						

		  <div class="row">
								
                                <asp:Repeater ID="Repeater_pview" runat="server"> 
                                   <%-- DataSourceID="SqlDataSource_pview"--%>
                                    <ItemTemplate>
                                    <div class="col-md-4 product-men mt-5">
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
												<span class="item_price"><%#Eval("prate") %></span>
												<del><%#Eval("mrp") %></del>
											</div>
                                            <a href="Details.aspx?pname=<%#Eval("pname")  %>" class="btn btn-primary">Compare Product</a>
											
										</div>
									</div>
								</div>
                                    </ItemTemplate>
                                
                                </asp:Repeater>
								<asp:SqlDataSource ID="SqlDataSource_pview" runat="server" 
                                    ConnectionString="<%$ ConnectionStrings:FunctionalConnectionString %>" 
                                    SelectCommand=""></asp:SqlDataSource>
								
								
								
							</div>
					

        </div>
    </form>
</asp:Content>

