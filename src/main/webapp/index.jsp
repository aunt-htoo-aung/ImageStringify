<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>My JSP Page</title>
</head>
<body>
    <h1>Welcome to my JSP page!</h1>

    <%
        // Java code can be embedded here within scriptlets
        String message = "This is dynamic content from a JSP scriptlet.";
        out.println("<p>" + message + "</p>");
    %>

    <%-- JSTL example (requires JSTL library configured) --%>
    <%--
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    <c:set var="name" value="User" />
    <p>Hello, <c:out value="${name}" />!</p>
    --%>

</body>
</html>