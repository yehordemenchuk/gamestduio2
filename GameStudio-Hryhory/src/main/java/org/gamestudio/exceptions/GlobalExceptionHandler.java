package org.gamestudio.exceptions;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler({EntityNotFoundException.class, IllegalArgumentException.class, EntityExistsException.class})
    public ResponseEntity<ErrorDetails> handleBadRequestExceptions(Exception e,
                                                                      WebRequest webRequest) {

        return handleException(e, webRequest, HttpStatus.BAD_REQUEST, Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleOtherExceptions(Exception e, WebRequest webRequest) {
        return handleException(e, webRequest, HttpStatus.INTERNAL_SERVER_ERROR, Map.of());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        List<ObjectError> errors = ex.getBindingResult().getAllErrors();

        Map<String, Object> details = new HashMap<>();

        errors.forEach(error -> {
           details.put(((FieldError) error).getField(), error.getDefaultMessage());
        });

        return new ResponseEntity<>(getErrorDetails("Invalid argument error", request,
                HttpStatus.BAD_REQUEST, details), status);
    }

    private ErrorDetails getErrorDetails(String message, WebRequest webRequest,
                                         HttpStatus status, Map<String, Object> details) {

        return new ErrorDetails(LocalDateTime.now(), message,
                Objects.nonNull(webRequest) ? webRequest.getDescription(false)
                : message,
                status.name(), details);
    }

    private ResponseEntity<ErrorDetails> handleException(Exception e,
                                                         WebRequest webRequest,
                                                         HttpStatus status,
                                                         Map<String, Object> details) {

        return new ResponseEntity<>(getErrorDetails(e.getMessage(),
                webRequest, status, details), status);
    }
}
