package ensias.mde.docker2manifest.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModelingDTO {
    private String dockerCompose;
    private String manifestK8S;
}
