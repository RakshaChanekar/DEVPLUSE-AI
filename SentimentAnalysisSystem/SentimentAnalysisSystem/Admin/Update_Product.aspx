<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/AdminMasterPage.master" AutoEventWireup="true" CodeFile="Update_Product.aspx.cs" Inherits="Admin_Add_Product" EnableEventValidation="false" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
<div class="product-sec1 px-sm-4 px-3 py-sm-5  py-3 mb-4">
<h3 class="heading-tittle text-center font-italic">Update Stock</h3>
<form runat="server">
	<div class="modal-body">
					<form action="#" method="post">
						
                        
                        <div class="form-group">
							<label class="col-form-label">Old Stock</label>
							<%--<input type="text" class="form-control" placeholder=" " name="Name" required="">--%>
                            <asp:TextBox ID="txtoldstock" runat="server" class="form-control" placeholder=" " Enabled="false"  required="" ></asp:TextBox>
						</div>
						 <div class="form-group">
							<label class="col-form-label">Add Stock</label>
							<%--<input type="text" class="form-control" placeholder=" " name="Name" required="">--%>
                            <asp:TextBox ID="txtstock" runat="server" class="form-control" placeholder=" "  required=""></asp:TextBox>
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

