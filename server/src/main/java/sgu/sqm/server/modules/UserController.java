package sgu.sqm.server.modules;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sgu.sqm.server.config.ApiResponse;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"*"})
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createUser(@RequestBody UserModel user) {
        return userService.createUser(user);
    }

    @PutMapping
    public ResponseEntity<ApiResponse> updateUserById(@RequestBody UserModel updatedUser) {
        return userService.updateUserById(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUserById(@PathVariable Long id) {
        return userService.deleteUserById(id);
    }

}
