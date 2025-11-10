package sgu.sqm.server.modules;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sgu.sqm.server.config.ApiResponse;

@Service
@Transactional
public class UserService {
    private static final String EMAIL_EXISTS_MESSAGE = "El correo electrónico ya está registrado";
    private static final String USER_NOT_FOUND_MESSAGE = "Usuario no encontrado";

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll() {
        return new ResponseEntity<>(new ApiResponse(userRepository.findAll(), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getById(Long id) {
        return new ResponseEntity<>(new ApiResponse(userRepository.findById(id).orElse(null), HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ApiResponse> createUser(UserModel user){
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new ResponseEntity<>(new ApiResponse(EMAIL_EXISTS_MESSAGE, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
        UserModel savedUser = userRepository.save(user);
        return new ResponseEntity<>(new ApiResponse(savedUser, HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ApiResponse> updateUserById(UserModel updatedUser) {
        return userRepository.findById(updatedUser.getId())
                .map(existingUser -> {
                    // Actualizar campos básicos
                    if (updatedUser.getName() != null) existingUser.setName(updatedUser.getName());
                    if (updatedUser.getPhone() != null) existingUser.setPhone(updatedUser.getPhone());
                    // Actualizar email con validación
                    if (!updateUserEmailIfValid(updatedUser, existingUser)) {
                        return new ResponseEntity<>(
                                new ApiResponse(EMAIL_EXISTS_MESSAGE, HttpStatus.BAD_REQUEST),
                                HttpStatus.BAD_REQUEST);
                    }

                    UserModel savedUser = userRepository.save(existingUser);
                    return new ResponseEntity<>(new ApiResponse(savedUser, HttpStatus.OK), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(
                        new ApiResponse(USER_NOT_FOUND_MESSAGE, HttpStatus.BAD_REQUEST),
                        HttpStatus.BAD_REQUEST));
    }

    @Transactional
    public ResponseEntity<ApiResponse> deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            return new ResponseEntity<>(new ApiResponse(USER_NOT_FOUND_MESSAGE, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }
        userRepository.deleteById(id);
        return new ResponseEntity<>(new ApiResponse("Usuario eliminada correctamente", HttpStatus.OK), HttpStatus.OK);
    }

    private boolean updateUserEmailIfValid(UserModel updatedUser, UserModel existingUser) {
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()
                && !updatedUser.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                return false;
            }
            existingUser.setEmail(updatedUser.getEmail());
        }
        return true;
    }
}

