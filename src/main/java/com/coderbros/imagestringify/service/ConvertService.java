package com.coderbros.imagestringify.service;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.servlet.http.Part;

import com.coderbros.imagestringify.exception.InvalidImageTypeException;
import com.coderbros.imagestringify.exception.LargeFileSizeException;
import com.coderbros.imagestringify.exception.ParameterMissingException;

public class ConvertService {
	private final long twoMbInBytes = 2 * 1024 * 1024;
	private static final Set<String> VALID_IMAGE_FORMATS = Set.of("png", "jpg", "jpeg", "gif", "bmp", "webp");

	public String convert(Part part, String outputFormat) throws Exception {
		if (outputFormat == null) {
			throw new ParameterMissingException("Parameter \\\"outputFormat\\\" not found. Need to fill parameter.");
		}
		if (part == null) {
			throw new FileNotFoundException("File Not Found. Please Upload Image.!!");
		}
		String mimeType = part.getContentType();
		if (mimeType == null || !mimeType.startsWith("image/")) {
			throw new InvalidImageTypeException("Invalid image type");
		}
		if (part.getSize() > twoMbInBytes) {
			throw new LargeFileSizeException("File is larger than 2 MB");
		}
		if (!VALID_IMAGE_FORMATS.contains(outputFormat.toLowerCase())) {
			throw new InvalidImageTypeException("Invalid output image format: " + outputFormat);
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
		if (!VALID_IMAGE_FORMATS.contains(outputFormat.toLowerCase())) {
			throw new InvalidImageTypeException("Invalid output image format: " + outputFormat);
		}

		String mimeType = base64.substring(5, base64.indexOf(";"));
		String inputFormat = mimeType.substring(mimeType.indexOf("/") + 1);

		if (!inputFormat.equalsIgnoreCase(outputFormat)) {
			byte[] imageBytes = Base64.getDecoder().decode(base64.substring(base64.indexOf(",") + 1));
			InputStream inputStream = new ByteArrayInputStream(imageBytes);
			imageBytes = convertImgFormat(inputStream, outputFormat);
			System.out.println("Image bytes : "+imageBytes);
			String newMimeType = "image/" + outputFormat.toLowerCase();
			return convertBase64(imageBytes, newMimeType);
		}
		return base64;
	}

	private String convertBase64(byte[] imgBytes, String mimeType) {
		String base64String = Base64.getEncoder().encodeToString(imgBytes);
		return ("data:" + mimeType + ";base64," + base64String);
	}

//	private byte[] convertImgFormat(InputStream is, String outputFormat) throws IOException {
//		BufferedImage image = ImageIO.read(is);
//		System.out.println("After buffer read"+image);
//		ByteArrayOutputStream baos = new ByteArrayOutputStream();
//		ImageIO.write(image, outputFormat, baos);
//		System.out.println("baos"+baos);
//		return baos.toByteArray();
//	}
	private byte[] convertImgFormat(InputStream is, String outputFormat) throws IOException {
	    BufferedImage image = ImageIO.read(is);
	    if (image == null) {
	        throw new IOException("Could not read input image.");
	    }

	    BufferedImage converted;
	    if ("jpeg".equalsIgnoreCase(outputFormat) || "jpg".equalsIgnoreCase(outputFormat)) {
	        // Flatten transparency for JPEG
	        converted = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
	        Graphics2D g = converted.createGraphics();
	        g.setColor(Color.WHITE); // white background
	        g.fillRect(0, 0, image.getWidth(), image.getHeight());
	        g.drawImage(image, 0, 0, null);
	        g.dispose();
	    } else {
	        // Preserve alpha for PNG/GIF/WebP
	        converted = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_ARGB);
	        Graphics2D g = converted.createGraphics();
	        g.drawImage(image, 0, 0, null);
	        g.dispose();
	    }

	    ByteArrayOutputStream baos = new ByteArrayOutputStream();
	    boolean success = ImageIO.write(converted, outputFormat, baos);
	    if (!success) {
	        throw new IOException("Could not write image in format: " + outputFormat);
	    }
	    return baos.toByteArray();
	}

}
