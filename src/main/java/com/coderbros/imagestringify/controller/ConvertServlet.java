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
        String action = request.getParameter("action");
        response.setContentType("application/json");
        if (action.equals("imgToOther")) {
            handleImageToOther(request, response);
        } else if (action.equals("base64ToImg")) {
            handleBytesToImage(request, response);
        } else {
        	HttpResponse.error(response, "Unknown action.");
        }
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpResponse.error(response, "Unknown action.");
	}

	private void handleBytesToImage(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String base64 = request.getParameter("base64");
		String outputFormat = request.getParameter("outputFormat");
		
		try {
			HttpResponse.success(response, "Successfully Converted.", new ConvertService().convert(base64,outputFormat));
		} catch (Exception e) {
			HttpResponse.error(response, e.getMessage());
		}
	}


	private void handleImageToOther(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		
		String outputFormat = request.getParameter("outputFormat");
		Part filePart = request.getPart("img");
		
		try {
			HttpResponse.success(response, "Successfully Converted.", new ConvertService().convert(filePart,outputFormat));
		} catch (Exception e) {
			HttpResponse.error(response, e.getMessage());
		}
	}
}
