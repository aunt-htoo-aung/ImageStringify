package com.coderbros.imagestringify.service;

import java.io.InputStream;
import java.util.Base64;

import javax.servlet.http.Part;

public class ConvertService {
	private final long twoMbInBytes = 2 * 1024 * 1024;

	public String convert(Part part) throws Exception {
		String mimeType = part.getContentType();
		if (mimeType == null || !mimeType.startsWith("image/")) {
			throw new IllegalArgumentException("Invalid image type");
		}
		if (part.getSize() > twoMbInBytes) {
			throw new IllegalArgumentException("File is larger than 2 MB");
		}
		InputStream is = part.getInputStream();
		byte[] imgBytes = is.readAllBytes();
		is.close();
		String base64String = Base64.getEncoder().encodeToString(imgBytes);
		return ("data:" + mimeType + ";base64," + base64String);
	}
}
