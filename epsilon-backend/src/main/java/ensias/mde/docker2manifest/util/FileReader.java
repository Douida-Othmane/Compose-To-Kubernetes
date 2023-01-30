package ensias.mde.docker2manifest.util;

import org.springframework.core.io.ClassPathResource;

import java.io.*;
import java.nio.charset.StandardCharsets;

public class FileReader {
    public static String readFile(String path)
    {
        //File file = ResourceUtils.getFile("classpath:".concat(path));
        ClassPathResource classPathResource = new ClassPathResource(path);
        String data = "";
        try
                (
                        InputStream inputStream = classPathResource.getInputStream();
                )
        {
            data = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return data;
    }
}
