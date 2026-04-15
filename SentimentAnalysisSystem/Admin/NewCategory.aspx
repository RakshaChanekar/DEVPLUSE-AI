<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/AdminMasterPage.master" AutoEventWireup="true" CodeFile="NewCategory.aspx.cs" Inherits="Admin_Add_Product" EnableEventValidation="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
<h3 class="heading-tittle text-center font-italic">Add New Item</h3>
<form runat="server">
	<div class="modal-body">
					<form action="#" method="post">
						<div class="form-group">
							<label class="col-form-label">Product Name</label>
							<%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                            <asp:TextBox ID="txtname" runat="server" class="form-control" placeholder=" "  required=""></asp:TextBox>
						</div>
						
                           <div class="form-group">
							<label class="col-form-label">Stock</label>
							   <%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                            <asp:TextBox ID="txtstock" runat="server" class="form-control" placeholder=" "  required=""></asp:TextBox>
						</div>
						<div class="form-group">
							<label class="col-form-label">Product Selling Rate</label>
							<%--<input type="submit" class="form-control" value="Log in">--%>
                            <asp:TextBox ID="txtrate" runat="server" class="form-control" placeholder=" "  required=""></asp:TextBox>
						</div>
                        <div class="form-group">
							<label class="col-form-label">Product MRP </label>
							<%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                            <asp:TextBox ID="txtMRP" runat="server" class="form-control" placeholder=" "  required=""></asp:TextBox>
						</div>
                        <div class="form-group">
							<label class="col-form-label">Display Size</label>
							<%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                            <asp:TextBox ID="txtDispaly" runat="server" class="form-control" placeholder=" "  required=""></asp:TextBox>
						</div>
                        <div class="form-group">
							<label class="col-form-label">Mobile Color</label>
							<%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                            <asp:TextBox ID="txtColor" runat="server" class="form-control" placeholder=" "  required=""></asp:TextBox>
						</div>
                        <div class="form-group">
							<label class="col-form-label">Memory</label>
							<%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                            <asp:TextBox ID="txtMemory" runat="server" class="form-control" placeholder=" "  required=""></asp:TextBox>
						</div>
                        <div class="form-group">
							<label class="col-form-label">Description</label>
							<%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                            <asp:TextBox ID="txtdescrib" runat="server" class="form-control" 
                                placeholder=" "  required="" TextMode="MultiLine"></asp:TextBox>
						</div>
                            <div class="form-group">
							<label class="col-form-label">Category</label>
							<%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                          
                                <asp:DropDownList ID="ddlCategory" runat="server" class="form-control" >
                                    <asp:ListItem>Laptop</asp:ListItem>
                                    <asp:ListItem>Camera</asp:ListItem>
                                </asp:DropDownList>
                           
						</div>
                         <div class="form-group">
							<label class="col-form-label">Photo Upload</label>
							<%--<input type="password" class="form-control" placeholder=" " name="Password" required="">--%>
                             <label class="col-form-label" style="color: #FF0000" >(Photo Size Must be 200px X 200px)</label><asp:FileUpload ID="FileUpload_product" class="form-control" runat="server" />
						</div>
						<div class="right-w3l">
							<%--<input type="submit" class="form-control" value="Log in">--%>
                            <asp:Button ID="btnsubmit" runat="server" class="form-control" Text="Submit" 
                                onclick="btnsubmit_Click"  />
                                <br />
                            <asp:Label ID="lblmsg" runat="server" Font-Bold="True" Font-Size="Medium" ForeColor="#FF9933"></asp:Label>
						</div>
						
					</form>
				</div>
                </form>
                </div>

</asp:Content>

