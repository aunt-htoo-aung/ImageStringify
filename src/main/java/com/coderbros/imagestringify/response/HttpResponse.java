package com.coderbros.imagestringify.response;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class HttpResponse {
	private static final Gson gson = new Gson();

	public static <T> void success(HttpServletResponse response, String message, T data) throws IOException {
		response.setStatus(200);
		Response<T> responseBody = new Response<T>(message, data);
		response.getWriter().write(gson.toJson(responseBody));
	}

	public static <T> void error(HttpServletResponse response, String message) throws IOException {
		response.setStatus(400);
		Response<T> responseBody = new Response<T>(message);
		response.getWriter().write(gson.toJson(responseBody));
	}
}
