package com.coderbros.imagestringify.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.coderbros.imagestringify.response.HttpResponse;
import com.coderbros.imagestringify.service.ConvertService;

/**
 * Servlet implementation class UploadServlet
 */
@MultipartConfig
@WebServlet("/api/v1/convert")
public class ConvertServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("application/json");
		Part filePart = request.getPart("img");
		try {
			HttpResponse.success(response, "Successfully Converted.", new ConvertService().convert(filePart));
		} catch (Exception e) {
			HttpResponse.error(response, e.getMessage(), null);
		}
	}

}
