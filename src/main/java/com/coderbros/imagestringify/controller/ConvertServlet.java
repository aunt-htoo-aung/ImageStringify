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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {

        response.setContentType("application/json");

        String action = request.getParameter("action");
        if (action == null || action.isEmpty()) {
            HttpResponse.error(response, "Missing 'action' parameter.");
            return;
        }

        switch (action) {
            case "imgToOther":
                handleImageToOther(request, response);
                break;
            case "base64ToImg":
                handleBytesToImage(request, response);
                break;
            default:
                HttpResponse.error(response, "Unknown action.");
        }
    }

    private void handleBytesToImage(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String base64 = request.getParameter("base64");
        String outputFormat = request.getParameter("outputFormat");

        if (base64 == null || base64.isEmpty()) {
            HttpResponse.error(response, "Base64 data is required.");
            return;
        }

        try {
            HttpResponse.success(
                response,
                "Successfully Converted.",
                new ConvertService().convert(base64, outputFormat)
            );
        } catch (Exception e) {
            HttpResponse.error(response, e.getMessage());
        }
    }

    private void handleImageToOther(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {

        String outputFormat = request.getParameter("outputFormat");
        Part filePart = request.getPart("img");

        if (filePart == null || filePart.getSize() == 0) {
            HttpResponse.error(response, "Image file is required.");
            return;
        }

        try {
            HttpResponse.success(
                response,
                "Successfully Converted.",
                new ConvertService().convert(filePart, outputFormat)
            );
        } catch (Exception e) {
            HttpResponse.error(response, e.getMessage());
        }
    }
}


