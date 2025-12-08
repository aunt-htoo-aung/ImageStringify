package com.coderbros.imagestringify.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

import javax.imageio.ImageIO;
import javax.servlet.http.Part;

import com.coderbros.imagestringify.exception.InvalidImageTypeException;
import com.coderbros.imagestringify.exception.LargeFileSizeException;
import com.coderbros.imagestringify.exception.ParameterMissingException;

public class ConvertService {
	private final long twoMbInBytes = 2 * 1024 * 1024;

	public String convert(Part part, String outputFormat) throws Exception {
		if (outputFormat == null) {
			throw new ParameterMissingException("Parameter \"outputFormat\" not found. Need to fill parameter.");
		}
		if (part == null) {
			throw new FileNotFoundException("File Not Found. Please Upload Image.");
		}
		String mimeType = part.getContentType();
		if (mimeType == null || !mimeType.startsWith("image/")) {
			throw new InvalidImageTypeException("Invalid image type");
		}
		if (part.getSize() > twoMbInBytes) {
			throw new LargeFileSizeException("File is larger than 2 MB");
		}
		InputStream is = part.getInputStream();
		byte[] imgBytes = is.readAllBytes();
		is.close();
		if (!(mimeType.substring(mimeType.indexOf("/") + 1)).equalsIgnoreCase(outputFormat)) {
			imgBytes = convertImgFormat(is, outputFormat);
		}
		return convertBase64(imgBytes, mimeType);
	}

	public String convert(String base64, String outputFormat) throws Exception {
		if (outputFormat == null) {
			throw new ParameterMissingException("Parameter \"outputFormat\" not found. Need to fill parameter.");
		}
		if (base64 == null) {
			throw new ParameterMissingException("Parameter \"base64\" not found. Need to fill parameter.");
		}
		String mimeType = base64.substring(5, base64.indexOf(";"));
		String inputFormat = mimeType.substring(mimeType.indexOf("/")+1);
		String result = base64;
		if (!inputFormat.equalsIgnoreCase(outputFormat)) {
			byte[] imageBytes = Base64.getDecoder().decode(base64.substring(base64.indexOf(",") + 1));
			InputStream inputStream = new ByteArrayInputStream(imageBytes);
			imageBytes = convertImgFormat(inputStream, outputFormat);
			result = convertBase64(imageBytes, mimeType);
		}
		return result;
	}

	private String convertBase64(byte[] imgBytes, String mimeType) {
		String base64String = Base64.getEncoder().encodeToString(imgBytes);
		return ("data:" + mimeType + ";base64," + base64String);
	}

	private byte[] convertImgFormat(InputStream is, String outputFormat) throws IOException {
		BufferedImage image = ImageIO.read(is);
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ImageIO.write(image, outputFormat, baos);
		return baos.toByteArray();
	}
}
